import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { OrderDto } from './dto/order.dto';
import { OrderStatus } from './enums/orderType';
import { OrderBookDto } from './dto/orderBook.dto';

@Injectable()
export class OrderRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async saveOrder(order: OrderDto): Promise<number[]> {
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
      order.status || OrderStatus.PENDING, // 기본값 설정
      order.filledQuantity || 0,
      order.unfilledQuantity || order.quantity,
      order.time || new Date()
    ];

    const result = await this.databaseService.query(query, values);
    return [result.rows[0].order_id, result.rows[0].member_id];
  }

  async updateOrder({
    orderId,
    status,
    filledQuantity,
    unfilledQuantity
  }: {
    orderId: number;
    status: OrderStatus;
    filledQuantity: number;
    unfilledQuantity: number;
  }): Promise<void> {
    const query = `
            UPDATE orders
            SET status            = $1,
                filled_quantity   = $2,
                unfilled_quantity = $3
            WHERE order_id = $4
        `;

    const values = [status, filledQuantity, unfilledQuantity, orderId];

    await this.databaseService.query(query, values);
  }

  async saveTransaction(
    order: OrderBookDto,
    price: number,
    matchedQuantity: number
  ): Promise<void> {
    const query = `
            INSERT INTO transactions (order_id, member_id, crop_id, trading_type, price, total_price, amount)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;

    console.log(order);
    const values = [
      order.orderId,
      order.memberId,
      order.cropId,
      order.tradingType,
      price,
      price * matchedQuantity,
      matchedQuantity
    ];

    await this.databaseService.query(query, values);
  }

  async getTransactionsByMemberId(memberId: number): Promise<OrderDto[]> {
    const query = `
            SELECT *
            FROM transactions
            WHERE member_id = $1
        `;

    const values = [memberId];

    const result = await this.databaseService.query(query, values);
    return result.rows;
  }
}
