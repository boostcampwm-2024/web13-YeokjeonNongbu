import { ApiProperty } from '@nestjs/swagger';

export class MailDto {
  @ApiProperty({ example: '1', description: '메일 ID' })
  mailId: string;

  @ApiProperty({
    example: '2024년 11월 18일 15시 30분에 당근을 500원에 20개 매수하였습니다.',
    description: '메일 내용'
  })
  content: string;

  @ApiProperty({
    example: '2024-11-11T15:00:00.000Z',
    description: '메일 생성 시간'
  })
  createdAt: string;

  @ApiProperty({ example: false, description: '읽음 여부' })
  readStatus: boolean;
}

export class MailResponseDto {
  @ApiProperty({ example: 200, description: '응답 코드' })
  code: number;

  @ApiProperty({ example: '2024-11-11T15:00:00.000Z', description: '응답 시간' })
  message: string;

  @ApiProperty({
    type: [MailDto],
    description: '메일 데이터 배열'
  })
  data: MailDto[];
}
