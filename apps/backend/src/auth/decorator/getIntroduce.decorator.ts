import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { GetIntroduceDto } from '../dto/getIntroduce.dto';

export function accountIntroduceDecorator() {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: '회원 소개 조회 성공',
      type: GetIntroduceDto
    })
  );
}
