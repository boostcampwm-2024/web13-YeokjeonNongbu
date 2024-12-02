import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseOrderDto } from './baseOrder.dto';
import { OrderStatus } from '../enums/orderType';

export class OrderDto extends BaseOrderDto {
  @ApiProperty({ description: '회원 번호', example: 15 })
  memberId: number;

  @ApiProperty({ description: '주문 상태', example: 'pending' })
  status: OrderStatus;

  @ApiPropertyOptional({
    description: '주문 가격 (지정가 주문일 경우 필수)',
    example: 1500,
    nullable: true
  })
  price: number | null;

  @ApiProperty({ description: '주문 시간', example: new Date() })
  time: Date;

  @ApiPropertyOptional({
    description: '주문 수량 (시장가 매수에서는 비워 둘 수 있음)',
    example: 100,
    nullable: true
  })
  quantity: number | null;

  @ApiPropertyOptional({
    description: '총 금액 (시장가 매수에서는 필수)',
    example: 150000,
    nullable: true
  })
  totalAmount: number | null;

  @ApiProperty({ description: '체결된 수량', example: 50 })
  filledQuantity: number;

  @ApiProperty({ description: '미체결 수량', example: 50 })
  unfilledQuantity: number | null;
}
