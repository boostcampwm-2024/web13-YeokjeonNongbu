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
                message: '주문이 성공적으로 삭제되었습니다.'
              }
            }
          }
        }
      }
    })
  );
}
