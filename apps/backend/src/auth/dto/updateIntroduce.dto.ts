import { ApiProperty } from '@nestjs/swagger';

export class UpdateIntroduceDto {
  @ApiProperty({
    description: '소개글',
    example: '나는 누구?'
  })
  introduce: string;
}

export class UpdateIntroduceSuccessResponseDto {
  @ApiProperty({
    description: '응답 코드',
    example: 200
  })
  code: number;

  @ApiProperty({
    description: '응답 메세지',
    example: '소개글이 변경되었습니다.'
  })
  message: string;
}
