import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { DatabaseService } from '../database/database.service';
import { JwtService } from '@nestjs/jwt';
import { ChartService } from 'src/chart/chart.service';

@WebSocketGateway({ cors: true })
export class WebsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private clients: Map<string, string> = new Map();
  private redisSubscriber: RedisClientType;

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly chartService: ChartService,
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType
  ) {
    this.redisSubscriber = this.redisClient.duplicate();
  }

  async onModuleInit() {
    await this.initializePubSub();
  }

  afterInit() {
    console.log('WebSocket Gateway Initialized');
  }

  async handleConnection(client: Socket) {
    const token = client.handshake.auth.authorization?.split(' ')[1];
    if (!token) {
      client.disconnect(true);
      return;
    }
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      const { memberId, nickname } = decoded;

      client.data = { memberId, nickname };
      this.clients.set(memberId, client.id);
      await this.sendMemberCropsData(client, memberId);
    } catch (error) {
      client.disconnect(true);
      console.log(error);
    }

    client.on('join', async ({ cropId }) => {
      if (cropId) {
        client.join(String(cropId));
        this.sendCurrentMarketState(client, cropId);
        this.getInitChartData(client, cropId);
        this.cropPricesTransfer();
      }
    });
  }

  handleDisconnect(client: Socket) {
    this.clients.delete(client.id);
  }

  async initializePubSub() {
    try {
      await this.redisSubscriber.connect();

      await this.databaseService.listenToChannel('member_crops_update', async payload => {
        const memberId = payload[0].member_id;
        if (!memberId) return;
        const query = `
                SELECT crop_id, available_quantity, pending_quantity, total_quantity
                FROM member_crops
                WHERE member_id = $1
            `;
        const crops = await this.databaseService.query(query, [memberId]);
        const data = crops.rows.map(crop => ({
          cropId: crop.crop_id,
          availableQuantity: crop.available_quantity,
          pendingQuantity: crop.pending_quantity,
          totalQuantity: crop.total_quantity
        }));

        this.cropDataTransfer(memberId, data);
      });

      await this.redisSubscriber.pSubscribe('__keyspace@0__:orderBook:*', async (_, message) => {
        const match = message.match(/orderBook:(\d+):.*/);
        if (match) {
          const cropId = match[1];
          await this.handleRedisUpdate(cropId);
        }
      });

      await this.redisSubscriber.pSubscribe('__keyspace@0__:crop:price', () => {
        this.cropPricesTransfer();
      });
    } catch (error) {
      console.log(error);
    }
  }

  private async sendMemberCropsData(client: Socket, memberId: string) {
    const query = `
      SELECT crop_id, available_quantity, pending_quantity, total_quantity
      FROM member_crops
      WHERE member_id = $1
    `;

    const crops = await this.databaseService.query(query, [memberId]);

    const data = crops.rows.map(crop => ({
      cropId: crop.crop_id,
      availableQuantity: crop.available_quantity,
      pendingQuantity: crop.pending_quantity,
      totalQuantity: crop.total_quantity
    }));

    client.emit('crops', data);
  }

  private async handleRedisUpdate(cropId: string) {
    const [buyOrders, sellOrders, nowPrice] = await Promise.all([
      this.redisClient.zRange(`orderBook:${cropId}:buy:limit`, 0, -1),
      this.redisClient.zRange(`orderBook:${cropId}:sell:limit`, 0, -1),
      this.redisClient.hGet('crop:price', String(cropId))
    ]);

    const data = {
      buyOrders: this.aggregateOrders(buyOrders),
      sellOrders: this.aggregateOrders(sellOrders),
      nowPrice: Number(nowPrice)
    };

    this.notifyClients(cropId, data);
  }

  private aggregateOrders(rawOrders: string[]): { price: number; quantity: number }[] {
    return rawOrders.reduce(
      (acc, orderString) => {
        const { price, unfilledQuantity } = JSON.parse(orderString);
        const existingOrder = acc.find(order => order.price === price);
        if (existingOrder) {
          existingOrder.quantity += unfilledQuantity;
        } else {
          acc.push({ price, quantity: unfilledQuantity });
        }
        return acc;
      },
      [] as { price: number; quantity: number }[]
    );
  }

  async notifyClients(cropId: string, data: any) {
    this.server.to(cropId).emit('market-update', data);
  }

  async chartMinDataTransfer(cropId: string, data: any) {
    this.server.to(String(cropId)).emit('minChart', data);
  }

  async chartHourDataTransfer(cropId: string, data: any) {
    this.server.to(String(cropId)).emit('hourChart', data);
  }

  async cropPricesTransfer() {
    const allPrices = await this.redisClient.hGetAll('crop:price');
    const prices = Object.entries(allPrices).map(([cropId, price]) => ({
      cropId: Number(cropId),
      price: Number(price)
    }));
    this.server.emit('prices', prices);
  }

  async cropDataTransfer(memberId: string, data: any) {
    const clientId = this.clients.get(memberId);
    if (clientId) {
      const client = this.server.sockets.sockets.get(clientId);
      if (client) {
        client.emit('crops', data);
      }
    }
  }

  async sendCurrentMarketState(client: Socket, cropId: string) {
    const [buyOrders, sellOrders, nowPrice] = await Promise.all([
      this.redisClient.zRange(`orderBook:${cropId}:buy:limit`, 0, -1),
      this.redisClient.zRange(`orderBook:${cropId}:sell:limit`, 0, -1),
      this.redisClient.hGet('crop:price', String(cropId))
    ]);

    const aggregatedBuyOrders = this.aggregateOrders(buyOrders);
    const aggregatedSellOrders = this.aggregateOrders(sellOrders);

    client.emit('market-update', {
      buyOrders: aggregatedBuyOrders,
      sellOrders: aggregatedSellOrders,
      nowPrice: Number(nowPrice)
    });
  }

  async getInitChartData(client: Socket, cropId: string) {
    const cropMinData = await this.chartService.getCropChartData(Number(cropId), 'M');
    const cropHourData = await this.chartService.getCropChartData(Number(cropId), 'H');
    client.emit('minChart', {
      cropMinData
    });
    client.emit('hourChart', {
      cropHourData
    });
  }
}
