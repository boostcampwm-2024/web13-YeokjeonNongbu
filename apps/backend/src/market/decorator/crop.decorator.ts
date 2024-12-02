import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { CropNameInfoResponseDto } from '../dto/response/cropNameInfoResponse.dto';
import { CropPriceInfoResponseDto } from '../dto/response/cropPriceInfoResponse.dto';

export function cropNameInfoResponseDecorator() {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: '작물 정보 조회 성공',
      type: CropNameInfoResponseDto
    })
  );
}

export function cropPriceInfoResponseDecorator() {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: '작물 가격 정보 조회 성공',
      type: CropPriceInfoResponseDto
    })
  );
}
