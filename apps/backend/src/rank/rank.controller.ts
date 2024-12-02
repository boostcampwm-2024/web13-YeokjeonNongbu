import { Controller, Get } from '@nestjs/common';
import { RankService } from './rank.service';
import { successhandler, successMessage } from 'src/global/successhandler';
import { ApiOperation } from '@nestjs/swagger';
import { top5rankResponseDecorator } from './decorator/top5rank.decorator';
import { User } from 'src/global/utils/memberData';
import { getRankResponseDecorator } from './decorator/getRank.decorator';

@Controller('api/rank')
export class RankController {
  constructor(private readonly rankService: RankService) {}
  @ApiOperation({ summary: '상위 랭킹 5명 반환 api' })
  @top5rankResponseDecorator()
  @Get('top5')
  async top5rank() {
    const data = await this.rankService.getTopRankings();
    return successhandler(successMessage.GET_TOP5_RANK_SUCCESS, data);
  }

  @ApiOperation({ summary: '현재 랭킹 반환 api' })
  @getRankResponseDecorator()
  @Get('now')
  async getRanking(@User() user: { nickname: string }) {
    const { nickname } = user;
    const data = await this.rankService.getRanking(nickname);
    return successhandler(successMessage.GET_RANK_SUCCESS, data);
  }
}
