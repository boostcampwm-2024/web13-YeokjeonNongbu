import { AccountCropDto } from './accountCrop.dto';
import { ApiProperty } from '@nestjs/swagger';

export class GetCropsByMemberDto extends AccountCropDto {
  @ApiProperty({
    description: '작물 이름',
    example: 'apple'
  })
  cropName: number;
}
