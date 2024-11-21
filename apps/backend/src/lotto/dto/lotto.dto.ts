import { ApiProperty } from '@nestjs/swagger';

export class lottoResponseDto {
  @ApiProperty({
    description: '당첨 등급, 5면 꽝입니다.',
    example: '1'
  })
  rank: number;

  @ApiProperty({
    description: '기존 현금 - 복권 비용 + 당첨 금액',
    example: '591000'
  })
  remainCash: number;

  @ApiProperty({
    description: '복권 구매 시간',
    example: '2024-11-20T07:57:38.894Z'
  })
  time: number;
}

export class LoginSuccessResponseDto {
  @ApiProperty({
    description: '응답 코드',
    example: 200
  })
  code: number;

  @ApiProperty({
    description: '응답 메세지',
    example: '복권 구매에 성공했습니다.'
  })
  message: string;

  @ApiProperty({
    description: '응답 데이터',
    type: lottoResponseDto
  })
  data: lottoResponseDto;
}
