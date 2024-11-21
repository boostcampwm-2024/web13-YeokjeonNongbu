import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiResponse } from '@nestjs/swagger';

export function TokenDecorator() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiHeader({
      name: 'Authorization',
      description: 'Bearer <token>',
      required: true,
      example: 'asjudjasdnsodnaowdoiqndoiqwnoidqwndioqwndasjdnalkjsnqw'
    }),
    ApiResponse({
      status: 401,
      description: '토큰 오류로 인한 API 호출 실패',
      content: {
        'application/json': {
          examples: {
            noTokens: {
              summary: '허가되지 않은 토큰',
              value: {
                code: 401,
                message: '허가되지 않은 사용자입니다.'
              }
            },
            blacklistTokens: {
              summary: '유효하지 않은 토큰',
              value: {
                code: 401,
                message: '유효하지 않은 토큰입니다.'
              }
            },
            invalidTokens: {
              summary: '잘못된 토큰',
              value: {
                code: 401,
                message: '잘못된 토큰입니다.'
              }
            },
            timeoutTokens: {
              summary: '만료된 토큰',
              value: {
                code: 401,
                message: '만료된 토큰입니다.'
              }
            }
          }
        }
      }
    })
  );
}
