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

export class LogoutFailure400ResponseDto {
  @ApiProperty({
    description: '응답 코드',
    example: 400
  })
  code: number;

  @ApiProperty({
    description: '응답 메세지',
    example: '토큰이 필요합니다.'
  })
  message: string;
}

export class LogoutFailure401ResponseDto {
  @ApiProperty({
    description: '응답 코드',
    example: 401
  })
  code: number;

  @ApiProperty({
    description: '응답 메세지',
    example: '유효하지 않은 토큰입니다.'
  })
  message: string;
}
