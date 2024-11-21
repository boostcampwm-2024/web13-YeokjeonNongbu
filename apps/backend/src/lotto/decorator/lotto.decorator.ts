import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { lottoResponseDto } from '../dto/lotto.dto';

export function lottoResponseDecorator() {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: '로그인 성공',
      type: lottoResponseDto
    }),
    ApiResponse({
      status: 400,
      description: '복권 구매할 돈이 부족합니다.',
      content: {
        'application/json': {
          examples: {
            notEnoughCash: {
              summary: '유저의 현금이 1000미만입니다.',
              value: {
                code: 400,
                message: '구매자의 자본금이 복권 최소 금액 보다 적습니다. 자본금 : 369'
              }
            }
          }
        }
      }
    })
  );
}
