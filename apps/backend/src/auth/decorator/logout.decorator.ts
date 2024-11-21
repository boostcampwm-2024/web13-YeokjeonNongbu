import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { LogoutSuccessResponseDto } from '../dto/logout.dto';
import { TokenDecorator } from 'src/global/utils/tokenSwagger';

export function logoutResponseDecorator() {
  return applyDecorators(
    TokenDecorator(),
    ApiResponse({
      status: 200,
      description: '로그아웃 성공',
      type: LogoutSuccessResponseDto
    })
  );
}
