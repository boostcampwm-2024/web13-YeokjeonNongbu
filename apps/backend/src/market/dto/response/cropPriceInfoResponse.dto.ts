import { ApiProperty } from '@nestjs/swagger';
import { CropPrice } from '../cropPrice.dto';

export class CropPriceInfoResponseDto {
  @ApiProperty({ example: 200, description: '응답 코드' })
  code: number;

  @ApiProperty({ example: '작물 가격 정보 조회 성공', description: '응답 메시지' })
  message: string;

  @ApiProperty({
    description: '작물 가격 데이터',
    type: CropPrice,
    isArray: true
  })
  data: CropPrice;
}
