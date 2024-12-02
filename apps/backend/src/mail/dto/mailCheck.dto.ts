import { ApiProperty } from '@nestjs/swagger';

export class checkDto {
  @ApiProperty({ example: true, description: '신규 알림 확인 여부' })
  mailId: string;

  @ApiProperty({
    example: '2024-11-11T15:00:00.000Z',
    description: '알림 생성 시간'
  })
  time: string;
}

export class MailCheckResponseDto {
  @ApiProperty({ example: 200 })
  code: number;

  @ApiProperty({ example: 'Catch alarm!' })
  message: string;

  @ApiProperty({ type: [checkDto], description: '알림 발생 데이터 예시' })
  data: checkDto;
}
