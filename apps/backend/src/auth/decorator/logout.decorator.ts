import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  LogoutFailure400ResponseDto,
  LogoutFailure401ResponseDto,
  LogoutSuccessResponseDto
} from '../dto/logout.dto';

export function logoutResponseDecorator() {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: '로그아웃 성공',
      type: LogoutSuccessResponseDto
    }),
    ApiResponse({
      status: 400,
      description: '토큰 없음',
      type: LogoutFailure400ResponseDto
    }),
    ApiResponse({
      status: 401,
      description: '만료된 토큰',
      type: LogoutFailure401ResponseDto
    })
  );
}
