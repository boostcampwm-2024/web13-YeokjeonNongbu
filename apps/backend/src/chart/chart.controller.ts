import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { successhandler, successMessage } from 'src/global/successhandler';
import { ChartService } from './chart.service';
import { Public } from 'src/global/utils/jwtAuthGuard';

@Controller('api/chart')
export class ChartContoller {
  constructor(private readonly chartService: ChartService) {}

  @Public()
  @Get('/min/:cropId')
  @ApiOperation({ summary: '분 단위 차트 데이터 요청 API, 토큰 필요없음' })
  async getMinuteChartData(@Param('cropId', ParseIntPipe) cropId: number) {
    const data = await this.chartService.getCropChartData(cropId, 'M');
    return successhandler(successMessage.GET_CROP_CHART_DATA_SUCCESS, data);
  }

  @Public()
  @Get('/hour/:cropId')
  @ApiOperation({ summary: '시간 단위 차트 데이터 요청 API, 토큰 필요없음' })
  async getHourChartData(@Param('cropId', ParseIntPipe) cropId: number) {
    const data = await this.chartService.getCropChartData(cropId, 'H');
    return successhandler(successMessage.GET_CROP_CHART_DATA_SUCCESS, data);
  }
}
