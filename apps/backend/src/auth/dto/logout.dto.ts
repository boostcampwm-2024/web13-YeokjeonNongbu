import { ApiProperty } from '@nestjs/swagger';

export class LogoutSuccessResponseDto {
  @ApiProperty({
    description: '응답 코드',
    example: 200
  })
  code: number;

  @ApiProperty({
    description: '응답 메세지',
    example: '로그아웃 되었습니다.'
  })
  message: string;
}
