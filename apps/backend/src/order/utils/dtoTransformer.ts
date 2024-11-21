import { OrderDto } from '../dto/order.dto';
import { OrderBookDto } from '../dto/orderBook.dto';
import { LimitOrderDto } from '../dto/limitOrder.dto';
import { OrderStatus } from '../enums/orderType';

export default class DtoTransformer {
  static toOrderBookDto(order: OrderDto, orderId: number, memberId: number): OrderBookDto {
    return {
      orderId,
      memberId,
      cropId: order.cropId,
      orderType: order.orderType,
      tradingType: order.tradingType,
      price: order.price,
      quantity: order.quantity,
      filledQuantity: order.filledQuantity,
      unfilledQuantity: order.quantity,
      time: order.time
    };
  }

  static toOrderDto(limitOrderDto: LimitOrderDto): OrderDto {
    return {
      cropId: limitOrderDto.cropId,
      memberId: limitOrderDto.memberId,
      orderType: limitOrderDto.orderType,
      tradingType: limitOrderDto.tradingType,
      time: new Date(), // 현재 시간으로 설정
      quantity: limitOrderDto.quantity,
      price: limitOrderDto.price,
      status: OrderStatus.PENDING, // 초기 상태를 기본값으로 설정
      filledQuantity: 0, // 초기 체결 수량
      unfilledQuantity: limitOrderDto.quantity // 전체 수량을 미체결로 설정
    };
  }
}
