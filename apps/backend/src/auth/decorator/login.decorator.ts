import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { LoginSuccessResponseDto } from 'src/auth/dto/login.dto';

export function loginResponseDecorator() {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: '로그인 성공',
      type: LoginSuccessResponseDto
    }),
    ApiResponse({
      status: 400,
      description: '잘못된 로그인 정보값 입력',
      content: {
        'application/json': {
          examples: {
            invalidEmail: {
              summary: '유효하지 않은 이메일 형식',
              value: {
                code: 400,
                message: '유효한 이메일 주소를 입력해주세요.'
              }
            },
            invalidNickname: {
              summary: '비밀번호가 8~16자 범위를 벗어남',
              value: {
                code: 400,
                message: '비밀번호는 8자에서 16자 사이로 입력해주세요.'
              }
            }
          }
        }
      }
    }),
    ApiResponse({
      status: 401,
      description: '권한 없음으로 인한 로그인 실패',
      content: {
        'application/json': {
          examples: {
            invalidCredentials: {
              summary: '잘못된 이메일 또는 비밀번호',
              value: {
                code: 401,
                message: '이메일 또는 비밀번호가 올바르지 않습니다.'
              }
            }
          }
        }
      }
    })
  );
}
