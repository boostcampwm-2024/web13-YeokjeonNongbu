import { OrderDto } from '../dto/order.dto';
import { OrderBookDto } from '../dto/orderBook.dto';
import { LimitOrderDto } from '../dto/limitOrder.dto';
import { MarketOrderDto } from '../dto/marketOrder.dto';
import { OrderStatus, OrderType, TradingType } from '../enums/orderType';

export default class DtoTransformer {
  static toOrderBookDto(order: OrderDto, orderId: number, memberId: number): OrderBookDto {
    return {
      orderId,
      memberId,
      cropId: order.cropId,
      orderType: order.orderType,
      tradingType: order.tradingType,
      price: order.tradingType === 'limit' ? order.price : null, // 시장가 거래는 price null
      quantity: order.tradingType === 'market' && order.orderType === 'buy' ? null : order.quantity,
      totalAmount:
        order.tradingType === 'market' && order.orderType === 'buy' ? order.totalAmount : null,
      filledQuantity: order.filledQuantity, // 체결된 수량
      unfilledQuantity:
        order.tradingType === 'market' && order.orderType === 'buy' ? null : order.unfilledQuantity,
      time: order.time
    };
  }

  static mapToOrderDto(orderDto: LimitOrderDto | MarketOrderDto, memberId: number): OrderDto {
    // 지정가 주문 처리
    if (orderDto.tradingType === TradingType.LIMIT) {
      if (orderDto.orderType === OrderType.BUY) {
        return this.toLimitBuyOrderDto(orderDto as LimitOrderDto, memberId);
      }
      if (orderDto.orderType === OrderType.SELL) {
        return this.toLimitSellOrderDto(orderDto as LimitOrderDto, memberId);
      }
    }

    // 시장가 주문 처리
    if (orderDto.tradingType === TradingType.MARKET) {
      if (orderDto.orderType === OrderType.BUY) {
        return this.toMarketBuyOrderDto(orderDto as MarketOrderDto, memberId);
      }
      if (orderDto.orderType === OrderType.SELL) {
        return this.toMarketSellOrderDto(orderDto as MarketOrderDto, memberId);
      }
    }

    throw new Error('잘못된 주문 유형입니다.');
  }

  private static toLimitBuyOrderDto(orderDto: LimitOrderDto, memberId: number): OrderDto {
    return {
      cropId: orderDto.cropId,
      memberId: memberId,
      orderType: OrderType.BUY,
      tradingType: TradingType.LIMIT,
      time: new Date(),
      quantity: orderDto.quantity,
      totalAmount: null, // 지정가 매수는 totalAmount 없음
      price: orderDto.price,
      status: OrderStatus.PENDING,
      filledQuantity: 0,
      unfilledQuantity: orderDto.quantity
    };
  }

  private static toLimitSellOrderDto(orderDto: LimitOrderDto, memberId: number): OrderDto {
    return {
      cropId: orderDto.cropId,
      memberId: memberId,
      orderType: OrderType.SELL,
      tradingType: TradingType.LIMIT,
      time: new Date(),
      quantity: orderDto.quantity,
      totalAmount: null, // 지정가 매도는 totalAmount 없음
      price: orderDto.price,
      status: OrderStatus.PENDING,
      filledQuantity: 0,
      unfilledQuantity: orderDto.quantity
    };
  }

  private static toMarketBuyOrderDto(orderDto: MarketOrderDto, memberId: number): OrderDto {
    return {
      cropId: orderDto.cropId,
      memberId: memberId,
      orderType: OrderType.BUY,
      tradingType: TradingType.MARKET,
      time: new Date(),
      quantity: null, // 시장가 매수는 quantity 없음
      price: null, // 시장가 매수는 price 없음
      status: OrderStatus.PENDING,
      filledQuantity: 0,
      unfilledQuantity: null,
      totalAmount: orderDto.totalAmount // 시장가 매수의 총 금액
    };
  }

  private static toMarketSellOrderDto(orderDto: MarketOrderDto, memberId: number): OrderDto {
    return {
      cropId: orderDto.cropId,
      memberId: memberId,
      orderType: OrderType.SELL,
      tradingType: TradingType.MARKET,
      time: new Date(),
      quantity: orderDto.quantity, // 시장가 매도는 quantity 필요
      price: null, // 시장가 매도는 price 없음
      status: OrderStatus.PENDING,
      filledQuantity: 0,
      unfilledQuantity: orderDto.quantity,
      totalAmount: null // 시장가 매도는 totalAmount 없음
    };
  }
}
