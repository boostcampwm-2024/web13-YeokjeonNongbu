import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { SignUpFailureResponseDto, SignUpSuccessResponseDto } from 'src/auth/dto/signUp.dto';

export function signUpResponseDecorator() {
  return applyDecorators(
    ApiResponse({
      status: 201,
      description: '회원가입 성공',
      type: SignUpSuccessResponseDto
    }),
    ApiResponse({
      status: 400,
      description: '유효한 이메일 주소를 입력해주세요.',
      type: SignUpFailureResponseDto
    }),
    ApiResponse({
      status: 400,
      description: '비밀번호는 8자에서 16자 사이로 입력해주세요.',
      type: SignUpFailureResponseDto
    }),
    ApiResponse({
      status: 400,
      description: '중복된 이메일입니다.',
      type: SignUpFailureResponseDto
    }),
    ApiResponse({
      status: 400,
      description: '닉네임은 2자에서 10자 사이로 입력해주세요.',
      type: SignUpFailureResponseDto
    })
  );
}
