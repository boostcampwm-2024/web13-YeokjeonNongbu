import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { OrderBookDto } from './dto/orderBook.dto';
import { OrderType } from './enums/orderType';
import { OrderRepository } from './order.repository';
import { OrderDto } from './dto/order.dto';

@Injectable()
export class OrderBookService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType,
    private readonly repository: OrderRepository
  ) {}

  async addOrder(order: OrderBookDto): Promise<void> {
    const orderKey = `orderBook:${order.cropId}:${order.orderType}`;
    const orderData = this.serializeOrder(order);
    await this.redisClient.zAdd(orderKey, { score: order.price, value: orderData });
  }

  async updateOrder(
    cropId: number,
    orderType: OrderType,
    orderId: number,
    filledQuantity: number
  ): Promise<void> {
    const orders =
      orderType === OrderType.BUY
        ? await this.getBuyOrdersFromRedis(cropId)
        : await this.getSellOrdersFromRedis(cropId);
    const targetOrder = orders.find(order => order.orderId === orderId);

    if (!targetOrder) {
      throw new Error(`주문번호 ${orderId}는 존재하지 않습니다.`);
    }

    targetOrder.unfilledQuantity -= filledQuantity;
    await this.removeOrder(cropId, orderId, orderType);

    if (targetOrder.unfilledQuantity > 0) {
      await this.addOrder(targetOrder);
    }
  }

  async removeOrder(cropId: number, orderId: number, orderType: 'buy' | 'sell'): Promise<void> {
    const orderKey = `orderBook:${cropId}:${orderType}`;
    const orders = await this.redisClient.zRange(orderKey, 0, -1);

    const orderToRemove = orders.find(order => this.deserializeOrder(order).orderId === orderId);
    if (orderToRemove) {
      await this.redisClient.zRem(orderKey, orderToRemove);
    }
  }

  async getTransactionsByMemberId(memberId: number): Promise<OrderDto[]> {
    return await this.repository.getTransactionsByMemberId(memberId);
  }

  async getBuyOrdersFromRedis(cropId: number): Promise<OrderBookDto[]> {
    const orderKey = `orderBook:${cropId}:sell`;
    const orders = await this.redisClient.zRange(orderKey, 0, -1);
    return orders.map((order: string) => this.deserializeOrder(order));
  }

  async getSellOrdersFromRedis(cropId: number): Promise<OrderBookDto[]> {
    const orderKey = `orderBook:${cropId}:sell`;
    const orders = await this.redisClient.zRange(orderKey, 0, -1);
    return orders.map((order: string) => this.deserializeOrder(order));
  }

  private serializeOrder(order: OrderBookDto): string {
    const time = order.time.toISOString();
    return JSON.stringify({ ...order, time });
  }

  private deserializeOrder(orderData: string): OrderBookDto {
    return JSON.parse(orderData) as OrderBookDto;
  }
}
