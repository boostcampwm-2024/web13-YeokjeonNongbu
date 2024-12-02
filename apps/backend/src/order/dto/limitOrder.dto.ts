import { ApiProperty } from '@nestjs/swagger';
import { BaseOrderDto } from './baseOrder.dto';
import { IsInt } from 'class-validator';

export class LimitOrderDto extends BaseOrderDto {
  @ApiProperty({ description: '주문 수량', example: 100 })
  @IsInt({ message: '수량은 정수여야 합니다.' })
  quantity: number;

  @ApiProperty({ description: '주문 가격', example: 50 })
  @IsInt({ message: '가격은 정수여야 합니다.' })
  price: number;
}
