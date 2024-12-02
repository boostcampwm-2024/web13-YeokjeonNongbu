import { ApiProperty } from '@nestjs/swagger';
import { OrderType, TradingType } from '../enums/orderType';

export class BaseOrderDto {
  @ApiProperty({ description: '상품 ID', example: 1 })
  cropId: number;

  @ApiProperty({ description: '주문 유형', example: 'buy' })
  orderType: OrderType;

  @ApiProperty({ description: '거래 유형', example: 'limit' })
  tradingType: TradingType;
}
