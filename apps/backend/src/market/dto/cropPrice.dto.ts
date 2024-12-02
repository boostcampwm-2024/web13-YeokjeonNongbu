import { ApiProperty } from '@nestjs/swagger';

export class CropPrice {
  @ApiProperty({ description: '작물 ID', example: 1 })
  cropId: number;

  @ApiProperty({ description: '작물 가격', example: 100 })
  price: number;
}
