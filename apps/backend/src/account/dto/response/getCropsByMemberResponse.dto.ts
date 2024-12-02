import { ApiProperty } from '@nestjs/swagger';
import { GetCropsByMemberDto } from '../getCropsByMember.dto';

export class GetCropsByMemberResponseDto {
  @ApiProperty({
    description: '응답 코드',
    example: 200
  })
  code: number;

  @ApiProperty({
    description: '응답 메세지',
    example: '계정 소유 전체 작물 조회에 성공했습니다.'
  })
  message: string;

  @ApiProperty({
    description: '응답 데이터',
    type: GetCropsByMemberDto,
    isArray: true
  })
  data: GetCropsByMemberDto;
}
