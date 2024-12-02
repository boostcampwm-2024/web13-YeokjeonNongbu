import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

  @ApiPropertyOptional({
    description: '가격 (지정가 주문일 경우 필수)',
    example: 50,
    nullable: true
  })
  price: number | null;

  @ApiPropertyOptional({
    description: '주문 수량 (시장가 매수는 없음)',
    example: 150,
    nullable: true
  })
  quantity: number | null;

  @ApiPropertyOptional({ description: '시장가 매수의 총 금액', example: 5000, nullable: true })
  totalAmount: number | null;

  @ApiProperty({ description: '체결된 수량', example: 50 })
  filledQuantity: number;

  @ApiPropertyOptional({
    description: '미체결 수량 (시장가 매수는 없음)',
    example: 100,
    nullable: true
  })
  unfilledQuantity: number | null;

  @ApiProperty({ description: '주문 시간', example: new Date() })
  time: Date;
}
