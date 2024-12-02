import { ApiProperty } from '@nestjs/swagger';
import { CropInfo } from '../crop.Info';

export class CropNameInfoResponseDto {
  @ApiProperty({ example: 200, description: '응답 코드' })
  code: number;

  @ApiProperty({ example: '작물 정보 조회 성공', description: '응답 메시지' })
  message: string;

  @ApiProperty({
    description: '작물 데이터',
    type: CropInfo,
    isArray: true
  })
  data: CropInfo;
}
