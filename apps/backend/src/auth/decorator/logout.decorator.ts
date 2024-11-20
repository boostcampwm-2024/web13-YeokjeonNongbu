import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { LogoutSuccessResponseDto } from '../dto/logout.dto';

export function logoutResponseDecorator() {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: '로그아웃 성공',
      type: LogoutSuccessResponseDto
    }),
    ApiResponse({
      status: 400,
      description: '로그아웃 실패 - 토큰 없음 오류',
      content: {
        'application/json': {
          examples: {
            noToken: {
              summary: '토큰 없음',
              value: {
                code: 400,
                message: '토큰이 필요합니다.'
              }
            }
          }
        }
      }
    }),
    ApiResponse({
      status: 401,
      description: '로그아웃 실패 - 인증 오류',
      content: {
        'application/json': {
          examples: {
            expiredToken: {
              summary: '만료된 토큰',
              value: {
                code: 401,
                message: '유효하지 않은 토큰입니다.'
              }
            }
          }
        }
      }
    })
  );
}
