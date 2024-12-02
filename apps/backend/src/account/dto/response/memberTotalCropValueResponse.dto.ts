import { ApiProperty } from '@nestjs/swagger';

export class MemberTotalCropValueResponseDto {
  @ApiProperty({ example: 200, description: '응답 코드' })
  code: number;

  @ApiProperty({ example: '회원의 총 보유 작물 가치 조회', description: '응답 메시지' })
  message: string;

  @ApiProperty({
    description: '작물 가격 데이터',
    example: { value: 110000 }
  })
  data: { value: number };
}
