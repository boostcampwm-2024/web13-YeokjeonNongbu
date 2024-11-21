import { Injectable } from '@nestjs/common';
import { OrderBookService } from './orderBook.service';
import { OrderStatus, OrderType } from './enums/orderType';
import { OrderService } from './order.service';
import { MarketService } from '../market/market.service';

@Injectable()
export class MatchingService {
  constructor(
    private readonly orderBookService: OrderBookService,
    private readonly orderService: OrderService,
    private readonly marketService: MarketService
  ) {}

  async matchOrders(cropId: number): Promise<void> {
    const buyOrders = await this.orderBookService.getBuyOrdersFromRedis(cropId);
    const sellOrders = await this.orderBookService.getSellOrdersFromRedis(cropId);

    let sellIndex = 0;
    let buyIndex = 0;

    while (sellIndex < sellOrders.length && buyIndex < buyOrders.length) {
      const sellOrder = sellOrders[sellIndex];
      const buyOrder = buyOrders[buyIndex];

      if (sellOrder.price > buyOrder.price) {
        break;
      }

      const matchedQuantity = Math.min(sellOrder.unfilledQuantity, buyOrder.unfilledQuantity);

      //TODO DB 트랜잭션 업데이트,체결 이벤트 발생
      // 1. 주문 DB 업데이트 v
      // 2. 체결 트랜잭션 DB 생성 및 저장 v
      // 3. 레디스 오더북 수정 v
      // 4. 현재 가격 업데이트 (레디스) v
      // 5. 체결 이벤트 발생
      // 이후 트랜잭션 적용 및 분리 예정

      // 1. 주문 DB 업데이트
      if (sellOrder.unfilledQuantity <= matchedQuantity) {
        await this.orderService.updateOrder(
          sellOrder.orderId,
          OrderStatus.COMPLETED,
          matchedQuantity,
          sellOrder.unfilledQuantity - matchedQuantity
        );
      } else if (sellOrder.unfilledQuantity > matchedQuantity) {
        await this.orderService.updateOrder(
          sellOrder.orderId,
          OrderStatus.PARTIALLY_FILLED,
          matchedQuantity,
          sellOrder.unfilledQuantity - matchedQuantity
        );
      }

      if (buyOrder.unfilledQuantity <= matchedQuantity) {
        await this.orderService.updateOrder(
          buyOrder.orderId,
          OrderStatus.COMPLETED,
          matchedQuantity,
          buyOrder.unfilledQuantity - matchedQuantity
        );
      } else if (buyOrder.unfilledQuantity > matchedQuantity) {
        await this.orderService.updateOrder(
          buyOrder.orderId,
          OrderStatus.PARTIALLY_FILLED,
          matchedQuantity,
          buyOrder.unfilledQuantity - matchedQuantity
        );
      }

      // 2. 체결 트랜잭션 DB 생성 및 저장
      await this.orderService.saveTransaction(sellOrder, buyOrder.price, matchedQuantity);
      await this.orderService.saveTransaction(buyOrder, buyOrder.price, matchedQuantity);

      // 3. 레디스 오더북 수정
      await this.orderBookService.updateOrder(
        cropId,
        OrderType.BUY,
        buyOrder.orderId,
        matchedQuantity
      );
      await this.orderBookService.updateOrder(
        cropId,
        OrderType.SELL,
        sellOrder.orderId,
        matchedQuantity
      );

      // 4. 현재 가격 업데이트 (레디스)
      const cropPrice = {
        crop: cropId,
        price: buyOrder.price
      };
      await this.marketService.setCropPrice(cropPrice);

      if (sellOrder.unfilledQuantity <= matchedQuantity) {
        sellIndex++;
      }

      if (buyOrder.unfilledQuantity <= matchedQuantity) {
        buyIndex++;
      }
    }
  }
}
