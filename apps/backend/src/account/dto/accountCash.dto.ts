import { ApiProperty } from '@nestjs/swagger';

export class AccountCashDto {
  @ApiProperty({ description: '사용 가능한 현금', example: 100000 })
  availableCash: number;

  @ApiProperty({ description: '주문 대기 중인 현금', example: 100000 })
  pendingCash: number;

  @ApiProperty({ description: '총 현금', example: 100000 })
  totalCash: number;
}
