import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: '사용자의 이메일',
    example: 'user@example.com'
  })
  email: string;

  @ApiProperty({
    description: '사용자의 비밀번호',
    example: 'password1234'
  })
  password: string;
}

export class LoginDataDto {
  @ApiProperty({
    description: 'Access Token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  accessToken: string;

  @ApiProperty({
    description: 'Refresh Token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  refreshToken: string;
}

export class LoginSuccessResponseDto {
  @ApiProperty({
    description: '응답 코드',
    example: 200
  })
  code: number;

  @ApiProperty({
    description: '응답 메세지',
    example: '로그인 되었습니다.'
  })
  message: string;

  @ApiProperty({
    description: '응답 데이터',
    type: LoginDataDto
  })
  data: LoginDataDto;
}
