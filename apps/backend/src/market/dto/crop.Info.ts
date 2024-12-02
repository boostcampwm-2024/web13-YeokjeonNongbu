import { ApiProperty } from '@nestjs/swagger';

export class CropInfo {
  @ApiProperty({ description: '작물 ID', example: 1 })
  cropId: number;

  @ApiProperty({ description: '작물 이름', example: 'apple' })
  cropName: string;
}
