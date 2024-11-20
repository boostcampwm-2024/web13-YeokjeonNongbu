import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { LoginSuccessResponseDto } from 'src/auth/dto/login.dto';

export function oauthResponseDecorator() {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: '로그인 성공',
      type: LoginSuccessResponseDto
    }),
    ApiResponse({
      status: 500,
      description: 'Oauth 서버 오류',
      content: {
        'application/json': {
          examples: {
            invalidEmail: {
              summary: '카카오 로그인 서버 오류',
              value: {
                code: 500,
                message: '카카오 로그인 서버 오류'
              }
            },
            invalidNickname: {
              summary: '구글 로그인 서버 오류',
              value: {
                code: 500,
                message: '구글 로그인 서버 오류'
              }
            }
          }
        }
      }
    })
  );
}
