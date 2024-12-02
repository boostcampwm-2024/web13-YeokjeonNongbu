import { OrderType } from '../enums/orderType';
import { ApiProperty } from '@nestjs/swagger';

export class TransactionDto {
  @ApiProperty({ description: '거래 ID', example: 1 })
  orderId: number;

  @ApiProperty({ description: '상품 ID', example: 1 })
  cropId: number;

  @ApiProperty({ description: '거래 유형', example: 'buy' })
  orderType: OrderType;

  @ApiProperty({ description: '거래 가격', example: 100 })
  price: number;

  @ApiProperty({ description: '총 거래 가격', example: 1000 })
  totalPrice: number;

  @ApiProperty({ description: '거래 날짜', example: '2024-11-21 16:48:32.23035+09' })
  createdAt: Date;

  @ApiProperty({ description: '거래 수량', example: 10 })
  amount: number;
}
