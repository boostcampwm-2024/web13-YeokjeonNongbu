import { ApiProperty } from '@nestjs/swagger';

export class PendingOrderDto {
  @ApiProperty({ description: '주문 ID', example: 1 })
  orderId: number;

  @ApiProperty({ description: '작물 ID', example: 1 })
  cropId: number;

  @ApiProperty({ description: '주문 타입', example: 'buy' })
  orderType: string;

  @ApiProperty({ description: '거래 타입', example: 'limit' })
  tradingType: string;

  @ApiProperty({ description: '주문 가격', example: 100 })
  price: number;

  @ApiProperty({ description: '총 주문 수량', example: 100 })
  quantity: number;

  @ApiProperty({ description: '체결 수량', example: 50 })
  filledQuantity: number;

  @ApiProperty({ description: '남은 수량', example: 50 })
  unfilledQuantity: number;

  @ApiProperty({ description: '주문 상태', example: 'pending' })
  status: string;

  @ApiProperty({ description: '주문 시간', example: new Date() })
  time: Date;
}
