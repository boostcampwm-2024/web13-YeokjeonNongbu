import { ApiProperty } from '@nestjs/swagger';
import { PendingOrderDto } from '../pendingOrder.dto';

export class GetOrderResponseDto {
  @ApiProperty({
    description: '응답 코드',
    example: 201
  })
  code: number;

  @ApiProperty({
    description: '응답 메세지',
    example: '진행중인 거래 내역 조회를 완료했습니다.'
  })
  message: string;

  @ApiProperty({
    description: '응답 데이터',
    type: PendingOrderDto,
    isArray: true
  })
  data: PendingOrderDto[];
}
