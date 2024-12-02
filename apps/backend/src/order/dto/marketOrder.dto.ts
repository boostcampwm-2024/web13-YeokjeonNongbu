import { ApiProperty } from '@nestjs/swagger';
import { BaseOrderDto } from './baseOrder.dto';

export class MarketOrderDto extends BaseOrderDto {
  @ApiProperty({ description: '총 주문 금액', example: 50000 })
  totalAmount: number;

  @ApiProperty({ description: '주문 수량', example: 100 })
  quantity: number | null;
}
