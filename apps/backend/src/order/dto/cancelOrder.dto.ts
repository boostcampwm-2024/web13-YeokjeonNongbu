import { BaseOrderDto } from './baseOrder.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CancelOrderDto extends BaseOrderDto {
  @ApiProperty({ description: '주문 번호', example: 1 })
  orderId: number;
}
