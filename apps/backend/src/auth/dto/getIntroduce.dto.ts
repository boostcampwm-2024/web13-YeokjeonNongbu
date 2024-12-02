import { ApiProperty } from '@nestjs/swagger';

export class GetIntroduceDto {
  @ApiProperty({ example: 200, description: '응답 코드' })
  code: number;

  @ApiProperty({ example: '회원 소개글 조회', description: '응답 메시지' })
  message: string;

  @ApiProperty({
    description: '회원 소개글',
    example: { introduce: 'ㅎㅇㅎㅇ' }
  })
  data: { introduce: string };
}
