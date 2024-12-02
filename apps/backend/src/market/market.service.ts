import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { CropPrice } from './dto/cropPrice.dto';
import { CropInfo } from './dto/crop.Info';
import { MarketRepository } from './market.repository';

@Injectable()
export class MarketService {
  private readonly redisKey = 'crop:price';

  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType,
    private readonly marketRepository: MarketRepository
  ) {}

  async setCropPriceToRedis(data: CropPrice): Promise<void> {
    await this.redisClient.hSet(this.redisKey, data.cropId.toString(), data.price.toString());
  }

  async saveCropPrice(data: CropPrice): Promise<void> {
    await this.marketRepository.insertCropPrice(data);
  }

  async getCropPrice(cropId: number): Promise<CropPrice | null> {
    const price = await this.marketRepository.getCurrentCropPrice(cropId);

    if (!price) {
      return null;
    }
    return price;
  }

  async getAllCropPrices() {
    const prices = await this.marketRepository.getAllCurrentCropsPrice();
    return prices.map(data => ({
      cropId: data.cropId,
      price: data.price
    }));
  }

  async getCropsInfo(): Promise<CropInfo[]> {
    return await this.marketRepository.getAllCropsInfo();
  }
}
