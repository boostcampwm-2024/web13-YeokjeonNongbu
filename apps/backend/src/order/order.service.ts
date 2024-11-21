import { Injectable } from '@nestjs/common';
import { OrderBookService } from './orderBook.service';
import { OrderRepository } from './order.repository';
import { OrderDto } from './dto/order.dto';
import { LimitOrderDto } from './dto/limitOrder.dto';
import DtoTransformer from './utils/dtoTransformer';
import { OrderStatus } from './enums/orderType';
import { OrderBookDto } from './dto/orderBook.dto';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderBookService: OrderBookService,
    private readonly orderRepository: OrderRepository
  ) {}

  async saveOrder(createOrderDto: LimitOrderDto): Promise<number[]> {
    const orderDto: OrderDto = DtoTransformer.toOrderDto(createOrderDto);
    const [orderId, memberId] = await this.orderRepository.saveOrder(orderDto);
    await this.saveOrderToOrderBook(orderDto, orderId, memberId);

    return [orderId, memberId];
  }

  private async saveOrderToOrderBook(
    order: OrderDto,
    orderId: number,
    memberId: number
  ): Promise<void> {
    const orderBookDto = DtoTransformer.toOrderBookDto(order, orderId, memberId);
    await this.orderBookService.addOrder(orderBookDto);
  }

  async saveTransaction(
    order: OrderBookDto,
    price: number,
    matchedQuantity: number
  ): Promise<void> {
    await this.orderRepository.saveTransaction(order, price, matchedQuantity);
  }

  async updateOrder(
    orderId: number,
    status: OrderStatus,
    filledQuantity: number,
    unfilledQuantity: number
  ): Promise<void> {
    await this.orderRepository.updateOrder({ orderId, status, filledQuantity, unfilledQuantity });
  }
}
