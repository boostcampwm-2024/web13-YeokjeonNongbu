import { ApiResponse } from '@nestjs/swagger';
import { GetTransactionResponseDto } from '../dto/response/getTransactionResponse.dto';
import { applyDecorators } from '@nestjs/common';

export function transactionResponseDecorator() {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: '회원 거래 기록 조회 성공',
      type: GetTransactionResponseDto
    })
  );
}
