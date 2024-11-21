import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { TokenDecorator } from 'src/global/utils/tokenSwagger';
import { UpdateNicknameSuccessResponseDto } from '../dto/updateNickname.dto';

export function updateNicknameResponseDecorator() {
  return applyDecorators(
    TokenDecorator(),
    ApiResponse({
      status: 200,
      description: '닉네임 수정 성공',
      type: UpdateNicknameSuccessResponseDto
    }),
    ApiResponse({
      status: 400,
      description: '유효하지 않은 입력값 에러',
      content: {
        'application/json': {
          examples: {
            invalidNickname: {
              summary: '닉네임이 2~10자 범위를 벗어남',
              value: {
                code: 400,
                message: '닉네임은 2자에서 10자 사이로 입력해주세요.'
              }
            }
          }
        }
      }
    })
  );
}
