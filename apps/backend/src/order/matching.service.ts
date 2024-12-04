import { OrderStatus, OrderType, TradingType } from './enums/orderType';
import { OrderBookService } from './orderBook.service';
import { OrderService } from './order.service';
import { MarketService } from '../market/market.service';
import { AccountService } from '../account/account.service';
import { OrderBookDto } from './dto/orderBook.dto';
import { Injectable } from '@nestjs/common';
import { MailService } from '../mail/mail.service';

@Injectable()
export class MatchingService {
  constructor(
    private readonly orderBookService: OrderBookService,
    private readonly orderService: OrderService,
    private readonly marketService: MarketService,
    private readonly accountService: AccountService,
    private readonly mailService: MailService
  ) {}

  async matchOrders(cropId: number): Promise<void> {
    const [buyOrders, sellOrders] = await this.fetchOrders(cropId);
    await this.processOrderMatching(cropId, buyOrders, sellOrders);
    await this.cleanMarketOrders(cropId, buyOrders, sellOrders);
  }

  private async fetchOrders(cropId: number) {
    const [buyOrders, sellOrders] = await Promise.all([
      this.orderBookService.getBuyOrdersFromRedis(cropId),
      this.orderBookService.getSellOrdersFromRedis(cropId)
    ]);
    return [buyOrders, sellOrders];
  }

  private async processOrderMatching(
    cropId: number,
    buyOrders: OrderBookDto[],
    sellOrders: OrderBookDto[]
  ): Promise<void> {
    let sellIndex = 0;
    let buyIndex = 0;

    while (sellIndex < sellOrders.length && buyIndex < buyOrders.length) {
      const sellOrder = sellOrders[sellIndex];
      const buyOrder = buyOrders[buyIndex];

      if (buyOrder.tradingType === TradingType.MARKET) {
        [sellIndex, buyIndex] = await this.handleMarketBuyOrder(
          cropId,
          buyOrder,
          sellOrder,
          sellIndex,
          buyIndex
        );
        continue;
      }

      if (sellOrder.tradingType === TradingType.MARKET) {
        [sellIndex, buyIndex] = await this.handleMarketSellOrder(
          cropId,
          buyOrder,
          sellOrder,
          sellIndex,
          buyIndex
        );
        continue;
      }

      [sellIndex, buyIndex] = await this.handleLimitOrder(
        cropId,
        buyOrder,
        sellOrder,
        sellIndex,
        buyIndex
      );
    }
  }

  private async handleMarketBuyOrder(
    cropId: number,
    buyOrder: OrderBookDto,
    sellOrder: OrderBookDto,
    sellIndex: number,
    buyIndex: number
  ): Promise<[number, number]> {
    if (!sellOrder) {
      return [sellIndex, buyIndex + 1];
    }

    const availableQuantity = this.calculateMarketBuyQuantity(buyOrder, sellOrder);
    const matchedAmount = availableQuantity * sellOrder.price!;

    await this.orderService.runInTransaction(async () => {
      await this.updateOrderQuantities(buyOrder, sellOrder, availableQuantity, matchedAmount);
      await this.processMatchAndUpdatePrice(cropId, buyOrder, sellOrder, availableQuantity);
    });

    return this.updateIndexes(
      sellOrder.unfilledQuantity! <= 0,
      buyOrder.totalAmount! <= 0 || availableQuantity === 0,
      sellIndex,
      buyIndex
    );
  }

  private async handleMarketSellOrder(
    cropId: number,
    buyOrder: OrderBookDto,
    sellOrder: OrderBookDto,
    sellIndex: number,
    buyIndex: number
  ): Promise<[number, number]> {
    if (!buyOrder) {
      return [sellIndex + 1, buyIndex];
    }

    const availableQuantity = Math.min(buyOrder.unfilledQuantity!, sellOrder.quantity!);

    await this.orderService.runInTransaction(async () => {
      await this.updateOrderQuantities(buyOrder, sellOrder, availableQuantity);
      await this.processMatchAndUpdatePrice(cropId, buyOrder, sellOrder, availableQuantity);
    });

    return this.updateIndexes(
      sellOrder.quantity! <= 0 || availableQuantity === 0,
      buyOrder.unfilledQuantity! <= 0,
      sellIndex,
      buyIndex
    );
  }

  private async handleLimitOrder(
    cropId: number,
    buyOrder: OrderBookDto,
    sellOrder: OrderBookDto,
    sellIndex: number,
    buyIndex: number
  ): Promise<[number, number]> {
    if (sellOrder.price! > buyOrder.price!) {
      return [sellIndex, buyIndex + 1];
    }

    const matchedQuantity = Math.min(sellOrder.unfilledQuantity!, buyOrder.unfilledQuantity!);

    await this.orderService.runInTransaction(async () => {
      await this.updateOrderQuantities(buyOrder, sellOrder, matchedQuantity);
      await this.processMatchAndUpdatePrice(cropId, buyOrder, sellOrder, matchedQuantity);
    });

    return this.updateIndexes(
      sellOrder.unfilledQuantity! <= 0,
      buyOrder.unfilledQuantity! <= 0,
      sellIndex,
      buyIndex
    );
  }

  private calculateMarketBuyQuantity(buyOrder: OrderBookDto, sellOrder: OrderBookDto): number {
    return Math.min(
      sellOrder.unfilledQuantity!,
      Math.floor(buyOrder.totalAmount! / sellOrder.price!)
    );
  }

  private async updateOrderQuantities(
    buyOrder: OrderBookDto,
    sellOrder: OrderBookDto,
    quantity: number,
    matchedAmount?: number
  ): Promise<void> {
    buyOrder.filledQuantity += quantity;
    sellOrder.filledQuantity += quantity;

    if (buyOrder.tradingType === TradingType.MARKET) {
      buyOrder.totalAmount! -= matchedAmount!;
    } else {
      buyOrder.unfilledQuantity! -= quantity;
    }

    if (sellOrder.tradingType === TradingType.MARKET) {
      sellOrder.quantity! -= quantity;
    } else {
      sellOrder.unfilledQuantity! -= quantity;
    }
  }

  private updateIndexes(
    incrementSell: boolean,
    incrementBuy: boolean,
    sellIndex: number,
    buyIndex: number
  ): [number, number] {
    return [sellIndex + (incrementSell ? 1 : 0), buyIndex + (incrementBuy ? 1 : 0)];
  }

  private async processMatchAndUpdatePrice(
    cropId: number,
    buyOrder: OrderBookDto,
    sellOrder: OrderBookDto,
    quantity: number
  ): Promise<void> {
    const matchedPrice = this.determineMatchPrice(buyOrder, sellOrder);
    await this.processOrderMatch(buyOrder, sellOrder, quantity, matchedPrice);
    await this.updateMarketPrice(cropId, matchedPrice);
  }

  private async updateMarketPrice(cropId: number, matchedPrice: number): Promise<void> {
    const price = matchedPrice;
    await this.marketService.saveCropPrice({ cropId, price });
    await this.marketService.setCropPriceToRedis({ cropId, price });
  }

  private async cleanMarketOrders(
    cropId: number,
    remainingBuyOrders: OrderBookDto[],
    remainingSellOrders: OrderBookDto[]
  ): Promise<void> {
    await this.orderService.runInTransaction(async () => {
      try {
        // 시장가 매수 주문 정리
        for (const buyOrder of remainingBuyOrders) {
          if (buyOrder.tradingType === TradingType.MARKET) {
            if (buyOrder.totalAmount! > 0) {
              await this.handlePendingRollback(
                cropId,
                buyOrder.memberId,
                buyOrder.totalAmount!,
                OrderType.BUY
              );
            }

            await this.orderService.updateOrder(
              buyOrder.orderId,
              OrderStatus.COMPLETED,
              buyOrder.filledQuantity,
              buyOrder.unfilledQuantity!,
              buyOrder.tradingType
            );

            // Redis 주문 제거
            await this.orderBookService.removeOrder(
              buyOrder.memberId,
              cropId,
              buyOrder.orderId,
              OrderType.BUY,
              TradingType.MARKET
            );
          }
        }

        // 시장가 매도 주문 정리
        for (const sellOrder of remainingSellOrders) {
          if (sellOrder.tradingType === TradingType.MARKET) {
            if (sellOrder.quantity! > 0) {
              await this.handlePendingRollback(
                cropId,
                sellOrder.memberId,
                sellOrder.quantity!,
                OrderType.SELL
              );
            }

            await this.orderService.updateOrder(
              sellOrder.orderId,
              OrderStatus.COMPLETED,
              sellOrder.filledQuantity,
              sellOrder.unfilledQuantity!,
              sellOrder.tradingType
            );

            // Redis 주문 제거
            await this.orderBookService.removeOrder(
              sellOrder.memberId,
              cropId,
              sellOrder.orderId,
              OrderType.SELL,
              TradingType.MARKET
            );
          }
        }
      } catch (error) {
        console.error('주문 정리 중 오류:', error);
        throw new Error('주문 정리 중 오류가 발생했습니다.');
      }
    });
  }

  private async processOrderMatch(
    buyOrder: OrderBookDto,
    sellOrder: OrderBookDto,
    matchedQuantity: number,
    matchedPrice: number
  ): Promise<void> {
    await this.orderService.runInTransaction(async () => {
      try {
        // 주문 오더 상태 업데이트
        await this.orderService.updateOrder(
          sellOrder.orderId,
          sellOrder.unfilledQuantity! > 0 || sellOrder.filledQuantity != sellOrder.quantity
            ? OrderStatus.PARTIALLY_FILLED
            : OrderStatus.COMPLETED,
          sellOrder.filledQuantity,
          sellOrder.unfilledQuantity!,
          sellOrder.tradingType
        );

        await this.orderService.updateOrder(
          buyOrder.orderId,
          buyOrder.unfilledQuantity! > 0 ||
            (buyOrder.totalAmount! > 0 && buyOrder.tradingType === TradingType.MARKET)
            ? OrderStatus.PARTIALLY_FILLED
            : OrderStatus.COMPLETED,
          buyOrder.filledQuantity,
          buyOrder.unfilledQuantity!,
          buyOrder.tradingType
        );

        // 트랜잭션 저장
        if (matchedQuantity > 0) {
          await this.orderService.saveTransaction(sellOrder, matchedPrice, matchedQuantity);
          await this.orderService.saveTransaction(buyOrder, matchedPrice, matchedQuantity);
        }

        // 캐시 및 작물 데이터 업데이트
        await this.accountService.updateCashByCompletingOrder(
          sellOrder.memberId,
          matchedPrice * matchedQuantity,
          OrderType.SELL
        );
        await this.accountService.updateCashByCompletingOrder(
          buyOrder.memberId,
          buyOrder.tradingType != TradingType.MARKET && buyOrder.price != matchedPrice
            ? buyOrder.price! * matchedQuantity
            : matchedPrice * matchedQuantity,
          OrderType.BUY
        );
        await this.accountService.updateCropByCompletingSellOrder(
          sellOrder.memberId,
          sellOrder.cropId,
          matchedQuantity
        );
        await this.accountService.updateCropByCompletingBuyOrder(
          buyOrder.memberId,
          buyOrder.cropId,
          matchedQuantity
        );

        // 체결 이벤트 알림 전달
        await this.mailService.createMailByOtherService(
          buyOrder.memberId,
          1,
          buyOrder.cropId,
          matchedPrice,
          matchedQuantity,
          null
        );

        await this.mailService.createMailByOtherService(
          sellOrder.memberId,
          2,
          sellOrder.cropId,
          matchedPrice,
          matchedQuantity,
          null
        );

        // 레디스 오더북 업데이트
        if (sellOrder.tradingType === TradingType.LIMIT && sellOrder.unfilledQuantity! > 0) {
          await this.orderBookService.updateOrder(
            sellOrder.memberId,
            sellOrder.cropId,
            OrderType.SELL,
            sellOrder.orderId,
            matchedQuantity,
            sellOrder.tradingType
          );
        }
        if (buyOrder.tradingType === TradingType.LIMIT && buyOrder.unfilledQuantity! > 0) {
          await this.orderBookService.updateOrder(
            buyOrder.memberId,
            buyOrder.cropId,
            OrderType.BUY,
            buyOrder.orderId,
            matchedQuantity,
            buyOrder.tradingType
          );
        }

        if (buyOrder.tradingType == TradingType.LIMIT && buyOrder.unfilledQuantity! === 0) {
          await this.orderBookService.removeOrder(
            buyOrder.memberId,
            buyOrder.cropId,
            buyOrder.orderId,
            OrderType.BUY,
            buyOrder.tradingType
          );
        }

        if (sellOrder.tradingType == TradingType.LIMIT && sellOrder.unfilledQuantity! === 0) {
          await this.orderBookService.removeOrder(
            sellOrder.memberId,
            sellOrder.cropId,
            sellOrder.orderId,
            OrderType.SELL,
            sellOrder.tradingType
          );
        }
      } catch (error) {
        console.error('주문 매칭 처리 중 오류:', error);
        throw new Error('주문 매칭 처리에 실패했습니다.');
      }
    });
  }

  private async handlePendingRollback(
    cropId: number,
    memberId: number,
    amountOrQuantity: number,
    orderType: OrderType
  ): Promise<void> {
    if (amountOrQuantity > 0) {
      if (orderType === OrderType.BUY) {
        await this.accountService.rollbackPendingCash(memberId, amountOrQuantity);
      } else if (orderType === OrderType.SELL) {
        await this.accountService.rollbackPendingCrop(cropId, memberId, amountOrQuantity);
      }
    }
  }

  private determineMatchPrice(buyOrder: OrderBookDto, sellOrder: OrderBookDto): number {
    const currentOrder = buyOrder.time > sellOrder.time ? buyOrder : sellOrder;

    if (sellOrder.tradingType === TradingType.MARKET && buyOrder.price) return buyOrder.price;
    if (buyOrder.tradingType === TradingType.MARKET && sellOrder.price) return sellOrder.price;
    if (buyOrder.price! >= sellOrder.price!) {
      return currentOrder.orderType === OrderType.BUY ? sellOrder.price! : buyOrder.price!;
    }
    throw new Error('체결 가격을 결정할 수 없습니다.');
  }
}
