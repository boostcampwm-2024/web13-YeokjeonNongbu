import { ApiResponse } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { GetOrderResponseDto } from '../dto/response/getOrderResponse.dto';

export function pendingOrdersDecorator() {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: '회원 진행 중인 오더 조회 성공',
      type: GetOrderResponseDto
    })
  );
}
