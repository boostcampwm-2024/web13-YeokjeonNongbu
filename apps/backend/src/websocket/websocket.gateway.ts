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

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly chartService: ChartService,
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType
  ) {}

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

      client.data.memberId = memberId;
      client.data.nickname = nickname;

      this.clients.set(memberId, client.id);
      await this.sendMemberCropsData(client, memberId);
    } catch (error) {
      client.disconnect(true);
      console.log(error);
    }

    client.on('join', async data => {
      const { cropId } = data;
      if (cropId) {
        client.join(String(cropId));
        this.sendCurrentMarketState(client, cropId);
        this.getInitChartData(client, cropId);
      }
    });
  }

  handleDisconnect(client: Socket) {
    this.clients.delete(client.id);
    console.log(`Client disconnected: ${client.id}`);
  }

  async initializePubSub() {
    const subscriber = this.redisClient.duplicate();
    try {
      await subscriber.connect();

      await this.databaseService.listenToChannel('member_crops_update', async payload => {
        const memberId = payload[0].member_id;
        const query = `
                SELECT crop_id, available_quantity, pending_quantity, total_quantity
                FROM member_crops
                WHERE member_id = $1
            `;
        const crops = await this.databaseService.query(query, [memberId]);
        this.cropDataTransfer(memberId, crops.rows);
      });

      await subscriber.pSubscribe('__keyspace@0__:orderBook:*', async (_, message) => {
        const match = message.match(/orderBook:(\d+):.*/);
        if (match) {
          const cropId = match[1];
          await this.handleRedisUpdate(cropId);
        }
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
    const buyOrders = await this.redisClient.zRange(`orderBook:${cropId}:buy:limit`, 0, -1);
    const sellOrders = await this.redisClient.zRange(`orderBook:${cropId}:sell:limit`, 0, -1);
    const price = await this.redisClient.hGet(`crop:price`, String(cropId));

    const aggregatedBuyOrders = this.aggregateOrders(buyOrders);
    const aggregatedSellOrders = this.aggregateOrders(sellOrders);

    this.notifyClients(cropId, {
      buyOrders: aggregatedBuyOrders,
      sellOrders: aggregatedSellOrders,
      nowPrice: Number(price)
    });
  }

  private aggregateOrders(rawOrders: string[]): { price: number; quantity: number }[] {
    const orderMap = new Map<number, number>();

    rawOrders.forEach(orderString => {
      const order = JSON.parse(orderString);
      const price = order.price;
      const quantity = order.unfilledQuantity;

      if (orderMap.has(price)) {
        orderMap.set(price, orderMap.get(price)! + quantity);
      } else {
        orderMap.set(price, quantity);
      }
    });

    return Array.from(orderMap.entries()).map(([price, quantity]) => ({
      price,
      quantity
    }));
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
    const buyOrders = await this.redisClient.zRange(`orderBook:${cropId}:buy:limit`, 0, -1);
    const sellOrders = await this.redisClient.zRange(`orderBook:${cropId}:sell:limit`, 0, -1);
    const nowPrice = await this.redisClient.hGet('crop:price', String(cropId));

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
