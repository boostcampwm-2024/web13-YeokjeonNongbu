import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({
    description: '사용자의 이메일 주소',
    example: 'user@example.com'
  })
  email: string;

  @ApiProperty({
    description: '사용자의 비밀번호',
    example: 'password1234'
  })
  password: string;

  @ApiProperty({
    description: '사용자의 닉네임',
    example: '닉네임'
  })
  nickname: string;
}

export class SignUpSuccessResponseDto {
  @ApiProperty({
    description: '응답 코드',
    example: 201
  })
  code: number;

  @ApiProperty({
    description: '응답 메세지',
    example: '회원 가입되었습니다.'
  })
  message: string;
}

export class SignUpFailureResponseDto {
  @ApiProperty({
    description: '응답 코드',
    example: 400
  })
  code: number;

  @ApiProperty({
    description: '응답 메세지',
    example: '유효한 이메일 주소를 입력해주세요.'
  })
  message: string;
}
