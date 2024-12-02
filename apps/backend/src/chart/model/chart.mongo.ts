import { Injectable } from '@nestjs/common';
import { Chart } from './chart.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ChartUtil {
  constructor(@InjectModel(Chart.name) private readonly chartModel: Model<Chart>) {}

  async addData(chartId: number) {
    const data = await this.chartModel.findOne({ chartId }).exec();
    console.log(data);
  }
}
