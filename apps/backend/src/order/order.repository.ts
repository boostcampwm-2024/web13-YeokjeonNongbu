import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { OrderDto } from './dto/order.dto';
import { OrderStatus, TradingType } from './enums/orderType';
import { OrderBookDto } from './dto/orderBook.dto';
import { TransactionDto } from './dto/transaction.dto';
import { Client } from 'pg';
import { PendingOrderDto } from './dto/pendingOrder.dto';

@Injectable()
export class OrderRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async saveOrder(order: OrderDto): Promise<number[]> {
    switch (order.tradingType) {
      case 'limit':
        return await this.saveLimitOrder(order);
      case 'market':
        return await this.saveMarketOrder(order);
      default:
        throw new Error(`Unsupported tradingType: ${order.tradingType}`);
    }
  }

  private async saveLimitOrder(order: OrderDto): Promise<number[]> {
    const query = `
            INSERT INTO orders (crop_id,
                                member_id,
                                order_type,
                                trading_type,
                                quantity,
                                price,
                                status,
                                filled_quantity,
                                unfilled_quantity,
                                time)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING order_id, member_id
        `;

    const values = [
      order.cropId,
      order.memberId,
      order.orderType,
      order.tradingType,
      order.quantity,
      order.price,
      order.status || OrderStatus.PENDING,
      order.filledQuantity || 0,
      order.unfilledQuantity || order.quantity,
      order.time || new Date()
    ];

    const result = await this.databaseService.query(query, values);
    return [result.rows[0].order_id, result.rows[0].member_id];
  }

  private async saveMarketOrder(order: OrderDto): Promise<number[]> {
    const query = `
            INSERT INTO orders (crop_id,
                                member_id,
                                order_type,
                                trading_type,
                                quantity,
                                price,
                                status,
                                filled_quantity,
                                unfilled_quantity,
                                total_amount,
                                time)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING order_id, member_id
        `;

    const values = [
      order.cropId,
      order.memberId,
      order.orderType,
      order.tradingType,
      order.quantity || null, // 시장가 매수는 수량이 없을 수 있음
      null, // 시장가 주문은 가격이 없음
      order.status || OrderStatus.PENDING,
      order.filledQuantity || 0,
      null, // 시장가 주문은 미체결 수량 없음
      order.totalAmount || null, // 시장가 매수의 총 금액
      order.time || new Date()
    ];

    const result = await this.databaseService.query(query, values);
    return [result.rows[0].order_id, result.rows[0].member_id];
  }

  async updateOrder(
    orderId: number,
    status: OrderStatus,
    filledQuantity: number,
    unfilledQuantity: number | null,
    tradingType: TradingType
  ): Promise<void> {
    const query =
      tradingType === TradingType.MARKET
        ? `
                        UPDATE orders
                        SET status          = $1,
                            filled_quantity = $2
                        WHERE order_id = $3
                `
        : `
                        UPDATE orders
                        SET status            = $1,
                            filled_quantity   = $2,
                            unfilled_quantity = $3
                        WHERE order_id = $4
                `;

    const values =
      tradingType === TradingType.MARKET
        ? [status, filledQuantity, orderId]
        : [status, filledQuantity, unfilledQuantity, orderId];

    await this.databaseService.query(query, values);
  }

  async saveTransaction(
    order: OrderBookDto,
    price: number,
    matchedQuantity: number
  ): Promise<void> {
    const query = `
            INSERT INTO transactions (order_id, member_id, crop_id, order_type, price, total_price, amount)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;

    const values = [
      order.orderId,
      order.memberId,
      order.cropId,
      order.orderType,
      price,
      price * matchedQuantity,
      matchedQuantity
    ];

    await this.databaseService.query(query, values);
  }

  // 특정 회원의 트랜잭션 조회
  async getTransactionsByMemberId(memberId: number): Promise<TransactionDto[]> {
    const query = `
            SELECT *
            FROM transactions
            WHERE member_id = $1
        `;

    const values = [memberId];
    const result = await this.databaseService.query(query, values);

    return result.rows.map(data => ({
      orderId: data.order_id,
      cropId: data.crop_id,
      orderType: data.order_type,
      price: data.price,
      totalPrice: data.total_price,
      createdAt: data.created_at,
      amount: data.amount
    }));
  }

  async getPendingOrdersByMemberId(memberId: number): Promise<PendingOrderDto[]> {
    const query = `
            SELECT *
            FROM orders
            WHERE member_id = $1
              AND status = 'pending'
        `;
    const values = [memberId];
    const result = await this.databaseService.query(query, values);

    return result.rows.map(data => ({
      orderId: data.order_id,
      cropId: data.crop_id,
      orderType: data.order_type,
      price: data.price,
      quantity: data.quantity,
      filledQuantity: data.filled_quantity,
      unfilledQuantity: data.unfilled_quantity,
      status: data.status,
      time: data.time
    }));
  }

  async getOrderById(memberId: number, orderId: number): Promise<OrderDto> {
    const query = `
            SELECT *
            FROM orders
            WHERE order_id = $1
              AND member_Id = $2
        `;
    const values = [orderId, memberId];
    const result = await this.databaseService.query(query, values);

    const data = result.rows[0];
    return {
      cropId: data.crop_id,
      memberId: data.member_id,
      orderType: data.order_type,
      tradingType: data.trading_type,
      quantity: data.quantity,
      price: data.price,
      status: data.status,
      filledQuantity: data.filled_quantity,
      unfilledQuantity: data.unfilled_quantity,
      totalAmount: data.total_amount,
      time: data.time
    };
  }

  async cancelOrder(memberId: number, orderId: number): Promise<void> {
    const query = `
            UPDATE orders
            SET status = 'canceled'
            WHERE order_id = $1
              AND member_id = $2
        `;

    const values = [orderId, memberId];
    await this.databaseService.query(query, values);
  }

  async runInTransaction(callback: (client: Client) => Promise<void>): Promise<void> {
    await this.databaseService.runInTransaction(callback);
  }
}
