import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { MarketService } from './market.service';
import {
  cropNameInfoResponseDecorator,
  cropPriceInfoResponseDecorator
} from './decorator/crop.decorator';
import { successhandler, successMessage } from '../global/successhandler';

@Controller('api/market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get('crop/price/:cropId')
  @cropPriceInfoResponseDecorator()
  async getPrice(@Param('cropId', ParseIntPipe) cropId: number) {
    const data = await this.marketService.getCropPrice(cropId);
    return successhandler(successMessage.GET_CROP_PRICE_INFO_SUCCESS, data);
  }

  @Get('crop/prices')
  @cropPriceInfoResponseDecorator()
  async getAllPrices() {
    const data = await this.marketService.getAllCropPrices();
    return successhandler(successMessage.GET_ALL_CROP_PRICE_INFO_SUCCESS, data);
  }

  @Get('crops')
  @cropNameInfoResponseDecorator()
  async getCropsInfo() {
    const data = await this.marketService.getCropsInfo();
    return successhandler(successMessage.GET_CROPS_NAME_INFO_SUCCESS, data);
  }
}
