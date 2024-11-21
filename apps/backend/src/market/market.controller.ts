import { Controller, Get, Param } from '@nestjs/common';
import { MarketService } from './market.service';

@Controller('api/market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get('price/:crop')
  async getPrice(@Param('crop') crop: number) {
    return this.marketService.getCropPrice(crop);
  }

  @Get('crop/prices')
  async getAllPrices() {
    return this.marketService.getAllCropPrices();
  }
}
