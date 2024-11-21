import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { LoginSuccessResponseDto } from 'src/auth/dto/login.dto';

export function oauthResponseDecorator() {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: '로그인 성공',
      type: LoginSuccessResponseDto
    })
  );
}
