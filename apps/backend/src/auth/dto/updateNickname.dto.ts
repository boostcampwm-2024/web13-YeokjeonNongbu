import { ApiProperty } from '@nestjs/swagger';

export class UpdateNicknameDto {
  @ApiProperty({
    description: '닉네임',
    example: '홍길동'
  })
  nickname: string;
}

export class UpdateNicknameSuccessResponseDto {
  @ApiProperty({
    description: '응답 코드',
    example: 200
  })
  code: number;

  @ApiProperty({
    description: '응답 메세지',
    example: '닉네임이 변경되었습니다.'
  })
  message: string;
}
