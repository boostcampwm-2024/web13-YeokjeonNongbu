import { Injectable } from '@nestjs/common';
import { OrderBookService } from './orderBook.service';
import { OrderRepository } from './order.repository';
import { OrderDto } from './dto/order.dto';
import DtoTransformer from './utils/dtoTransformer';
import { OrderStatus, OrderType, TradingType } from './enums/orderType';
import { OrderBookDto } from './dto/orderBook.dto';
import { AccountService } from '../account/account.service';
import { TransactionDto } from './dto/transaction.dto';
import { PendingOrderDto } from './dto/pendingOrder.dto';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderBookService: OrderBookService,
    private readonly orderRepository: OrderRepository,
    private readonly accountService: AccountService
  ) {}

  async saveOrder(orderDto: OrderDto): Promise<number[]> {
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

  // 주문 업데이트
  async updateOrder(
    orderId: number,
    status: OrderStatus,
    filledQuantity: number,
    unfilledQuantity: number | null,
    tradingType: TradingType
  ): Promise<void> {
    await this.orderRepository.updateOrder(
      orderId,
      status,
      filledQuantity,
      unfilledQuantity,
      tradingType
    );
  }

  async cancelOrder(
    memberId: number,
    orderId: number,
    cropId: number,
    orderType: OrderType
  ): Promise<void> {
    await this.rollbackMemberData(memberId, orderId, cropId, orderType);
    await this.orderRepository.cancelOrder(memberId, orderId);
  }

  private async rollbackMemberData(
    memberId: number,
    orderId: number,
    cropId: number,
    orderType: OrderType
  ): Promise<void> {
    const order = await this.orderRepository.getOrderById(memberId, orderId);

    if (orderType === OrderType.BUY) {
      await this.accountService.rollbackPendingCash(
        memberId,
        order.price! * order.unfilledQuantity!
      );
      return;
    }

    if (orderType === OrderType.SELL) {
      await this.accountService.rollbackPendingCrop(memberId, cropId, order.unfilledQuantity!);
      return;
    }
  }

  async getTransactionsByMemberId(memberId: number): Promise<TransactionDto[]> {
    return await this.orderRepository.getTransactionsByMemberId(memberId);
  }

  async getPendingOrdersByMemberId(memberId: number): Promise<PendingOrderDto[]> {
    return await this.orderRepository.getPendingOrdersByMemberId(memberId);
  }
}
