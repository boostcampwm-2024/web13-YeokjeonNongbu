import { ApiProperty } from '@nestjs/swagger';

export class AccountCropDto {
  @ApiProperty({ description: '작물 ID', example: 1 })
  cropId: number;

  @ApiProperty({ description: '작물 수량', example: 100 })
  quantity: number;
}
