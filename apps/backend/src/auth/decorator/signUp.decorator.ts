import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { SignUpSuccessResponseDto } from 'src/auth/dto/signUp.dto';

export function signUpResponseDecorator() {
  return applyDecorators(
    ApiResponse({
      status: 201,
      description: '회원가입 성공',
      type: SignUpSuccessResponseDto
    }),
    ApiResponse({
      status: 400,
      description: '유효하지 않은 입력값 에러',
      content: {
        'application/json': {
          examples: {
            invalidEmail: {
              summary: '유효하지 않은 이메일',
              value: {
                code: 400,
                message: '유효한 이메일 주소를 입력해주세요.'
              }
            },
            shortPassword: {
              summary: '비밀번호가 8~16자 범위를 벗어남',
              value: {
                code: 400,
                message: '비밀번호는 8자에서 16자 사이로 입력해주세요.'
              }
            },
            duplicateEmail: {
              summary: '중복된 이메일',
              value: {
                code: 400,
                message: '중복된 이메일입니다.'
              }
            },
            invalidNickname: {
              summary: '닉네임이 2~10자 범위를 벗어남',
              value: {
                code: 400,
                message: '닉네임은 2자에서 10자 사이로 입력해주세요.'
              }
            }
          }
        }
      }
    })
  );
}
