import { DatabaseService } from '../database/database.service';
import { Injectable } from '@nestjs/common';
import { CropPrice } from './dto/cropPrice.dto';

@Injectable()
export class MarketRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async insertCropPrice(data: { cropId: number; price: number }): Promise<void> {
    const query = `
            INSERT INTO crop_prices (crop_id, price, time)
            VALUES ($1, $2, DEFAULT)
        `;
    const values = [data.cropId, data.price];

    await this.databaseService.query(query, values);
  }

  async getAllCropsInfo() {
    const query = `
            SELECT *
            FROM crops
        `;

    const result = await this.databaseService.query(query);
    const data = result.rows;

    return data.map(data => ({
      cropId: data.crop_id,
      cropName: data.crop_name
    }));
  }

  async getAllCurrentCropsPrice(): Promise<CropPrice[]> {
    const query = `
            SELECT DISTINCT
            ON (crop_id) crop_id, price, time
            FROM crop_prices
            ORDER BY crop_id, time DESC
        `;

    const result = await this.databaseService.query(query);

    return result.rows.map(data => ({
      cropId: data.crop_id,
      price: data.price
    }));
  }

  async getCurrentCropPrice(cropId: number): Promise<CropPrice | null> {
    const query = `
            SELECT price, time
            FROM crop_prices
            WHERE crop_id = $1
            ORDER BY time DESC
                LIMIT 1
        `;
    const values = [cropId];

    const result = await this.databaseService.query(query, values);
    if (result.rowCount === 0) {
      return null;
    }

    const data = result.rows[0];
    return {
      cropId,
      price: data.price
    };
  }
}
