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

export class LoginFailure400ResponseDto {
  @ApiProperty({
    description: '응답 코드',
    example: 400
  })
  code: number;

  @ApiProperty({
    description: '응답 메세지',
    example: '유효한 이메일 주소를 입력해주세요. || 닉네임은 2자에서 10자 사이로 입력해주세요.'
  })
  message: string;
}

export class LoginFailure401ResponseDto {
  @ApiProperty({
    description: '응답 코드',
    example: 401
  })
  code: number;

  @ApiProperty({
    description: '응답 메세지',
    example: '이메일 또는 비밀번호가 올바르지 않습니다.'
  })
  message: string;
}
