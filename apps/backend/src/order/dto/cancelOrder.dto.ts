import { BaseOrderDto } from './baseOrder.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CancelOrderDto extends BaseOrderDto {
  @ApiProperty({ description: '주문 번호', example: 1 })
  @IsInt({ message: '주문 번호는 정수여야 합니다.' })
  orderId: number;
}
