import { ApiProperty } from '@nestjs/swagger';
import { OrderType, TradingType } from '../enums/orderType';

export class OrderBookDto {
  @ApiProperty({ description: '주문 ID', example: 1 })
  orderId: number;

  @ApiProperty({ description: '회원 ID', example: 15 })
  memberId: number;

  @ApiProperty({ description: '상품 ID', example: 1 })
  cropId: number;

  @ApiProperty({ description: '주문 유형', example: 'buy' })
  orderType: OrderType;

  @ApiProperty({ description: '오더 유형', example: 'limit' })
  tradingType: TradingType;

  @ApiProperty({ description: '가격', example: 50 })
  price: number;

  @ApiProperty({ description: '주문 수량', example: 150 })
  quantity: number;

  @ApiProperty({ description: '체결된 수량', example: 50 })
  filledQuantity: number;

  @ApiProperty({ description: '미체결 수량', example: 100 })
  unfilledQuantity: number;

  @ApiProperty({ description: '주문 시간', example: new Date() })
  time: Date;
}
