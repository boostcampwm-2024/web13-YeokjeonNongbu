import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function orderResponseDecorator() {
  return applyDecorators(
    ApiResponse({
      status: 201,
      description: '주문 생성 성공',
      content: {
        'application/json': {
          examples: {
            success: {
              summary: '주문 생성 성공',
              value: {
                code: 201,
                message: '주문이 성공적으로 생성되었습니다.'
              }
            }
          }
        }
      }
    })
  );
}

export function cancelOrderResponseDecorator() {
  return applyDecorators(
    ApiResponse({
      status: 201,
      description: '주문 취소 성공',
      content: {
        'application/json': {
          examples: {
            success: {
              summary: '주문 취소 성공',
              value: {
                code: 201,
                message: '주문이 성공적으로 삭제되었습니다.',
                data: [] // Example of pending orders data
              }
            }
          }
        }
      }
    }),
    ApiResponse({
      status: 500,
      description: '서버 오류',
      content: {
        'application/json': {
          examples: {
            serverError: {
              summary: '서버 오류 발생',
              value: {
                code: 500,
                message: '서버에서 오류가 발생했습니다.'
              }
            }
          }
        }
      }
    })
  );
}
