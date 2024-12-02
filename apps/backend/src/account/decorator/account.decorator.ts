import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { GetCashResponseDto } from '../dto/getCashResponse.dto';
import { GetCropsByMemberResponseDto } from '../dto/response/getCropsByMemberResponse.dto';
import { GetCropByMemberResponseDto } from '../dto/response/getCropByMemberResponse.dto';
import { MemberTotalCropValueResponseDto } from '../dto/response/memberTotalCropValueResponse.dto';

export function accountCashDecorator() {
  return applyDecorators(
    ApiResponse({
      status: 201,
      description: '회원 잔고 조회 성공',
      type: GetCashResponseDto
    })
  );
}

export function accountCropDecorator() {
  return applyDecorators(
    ApiResponse({
      status: 201,
      description: '회원 작물 조회 성공',
      type: GetCropByMemberResponseDto
    })
  );
}

export function accountCropsDecorator() {
  return applyDecorators(
    ApiResponse({
      status: 201,
      description: '회원 보유 전체 작물 조회 성공',
      type: GetCropsByMemberResponseDto
    })
  );
}

export function accountCropValueDecorator() {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: '회원의 총 보유 작물 가치 조회',
      type: MemberTotalCropValueResponseDto
    })
  );
}
