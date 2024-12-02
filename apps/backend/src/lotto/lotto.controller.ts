import { Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { LottoService } from './lotto.service';
import { successhandler, successMessage } from 'src/global/successhandler';
import { lottoResponseDecorator } from './decorator/lotto.decorator';
import { User } from 'src/global/utils/memberData';

@Controller('api/lotto')
@ApiBearerAuth()
export class LottoController {
  constructor(private readonly lottoService: LottoService) {}

  @Post()
  @ApiOperation({ summary: '복권 긁기 요청 API' })
  @lottoResponseDecorator()
  async buyLotto(@User() user: { memberId: number }) {
    const { memberId } = user;
    if (!memberId) {
      throw new Error('올바르지 않은 사용자입니다.');
    }

    const result = await this.lottoService.buyLotto(memberId);
    return successhandler(successMessage.BUY_LOTTO_SUCCESS, result);
  }
}
