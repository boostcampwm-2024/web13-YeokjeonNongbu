import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { TokenDecorator } from 'src/global/utils/tokenSwagger';
import { UpdateIntroduceSuccessResponseDto } from '../dto/updateIntroduce.dto';

export function updateIntroduceResponseDecorator() {
  return applyDecorators(
    TokenDecorator(),
    ApiResponse({
      status: 200,
      description: '소개글 수정 성공',
      type: UpdateIntroduceSuccessResponseDto
    })
  );
}
