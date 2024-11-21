import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  LoginFailure400ResponseDto,
  LoginFailure401ResponseDto,
  LoginSuccessResponseDto
} from 'src/auth/dto/login.dto';

export function loginResponseDecorator() {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: '로그인 성공',
      type: LoginSuccessResponseDto
    }),
    ApiResponse({
      status: 400,
      description: '이메일 || 비밀번호 오류',
      type: LoginFailure400ResponseDto
    }),
    ApiResponse({
      status: 401,
      description: '로그인 실패 오류',
      type: LoginFailure401ResponseDto
    })
  );
}
