import { ApiProperty } from '@nestjs/swagger';
import { TransactionDto } from '../transaction.dto';

export class GetTransactionResponseDto {
  @ApiProperty({
    description: '응답 코드',
    example: 200
  })
  code: number;

  @ApiProperty({
    description: '응답 메세지',
    example: '거래 내역 조회를 완료했습니다.'
  })
  message: string;

  @ApiProperty({
    description: '응답 데이터',
    type: TransactionDto,
    isArray: true
  })
  data: TransactionDto[];
}
