import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { chartQueries } from './chart.query';
import { InjectModel } from '@nestjs/mongoose';
import { Chart } from './model/chart.schema';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { WebsocketGateway } from 'src/websocket/websocket.gateway';

@Injectable()
export class ChartService implements OnModuleInit {
  constructor(
    @Inject(forwardRef(() => WebsocketGateway))
    private readonly webSocketGateway: WebsocketGateway,
    private readonly databaseService: DatabaseService,
    @InjectModel(Chart.name) private readonly chartModel: Model<Chart>
  ) {}

  @Cron(CronExpression.EVERY_MINUTE) // 매 분 실행
  async handleEveryMinute() {
    console.log('분단위 췍!');
    const cropIds = (await this.databaseService.query(chartQueries.getCrops, [])).rows;
    for (const cd of cropIds) {
      const cropId = cd.crop_id;

      const cropData = `M${cropId}`;
      const minuteLastChart = await this.chartModel
        .findOne({ cropData })
        .sort({ 'column.x': -1 })
        .select('column');
      const mLastTime = minuteLastChart?.column[minuteLastChart.column.length - 1].x;
      const mLastValue = minuteLastChart?.column[minuteLastChart.column.length - 1].y;
      const mTransactions = (
        await this.databaseService.query(chartQueries.getAllTransactionUpperTime, [
          cropId,
          mLastTime?.toISOString()
        ])
      ).rows;
      const mColumn = await this.makeRawData(mTransactions, 1, mLastTime, mLastValue);
      const existingMinuteChart = await this.chartModel.findOne({ cropData });
      if (existingMinuteChart) {
        existingMinuteChart.column.push(...mColumn!);
        await existingMinuteChart.save();
      } else {
        const chart = new this.chartModel({ cropData, mColumn, name });
        await chart.save();
      }

      const cropsData = await this.getCropChartData(cropId, 'M');
      const cropMinChartData = { cropMinData: cropsData };
      this.webSocketGateway.chartMinDataTransfer(cropId, cropMinChartData);
    }
  }

  @Cron(CronExpression.EVERY_HOUR) // 매 시간 실행
  async handleEveryHour() {
    console.log('시간단위 췍!');
    const cropIds = (await this.databaseService.query(chartQueries.getCrops, [])).rows;
    for (const cd of cropIds) {
      const cropId = cd.crop_id;
      const cropData = `H${cropId}`;
      const hourLastChart = await this.chartModel
        .findOne({ cropData })
        .sort({ 'column.x': -1 })
        .select('column');
      const hLastTime = hourLastChart?.column[hourLastChart.column.length - 1].x;
      const hLastValue = hourLastChart?.column[hourLastChart.column.length - 1].y;
      const hTransactions = (
        await this.databaseService.query(chartQueries.getAllTransactionUpperTime, [
          cropId,
          hLastTime?.toISOString()
        ])
      ).rows;
      const hColumn = await this.makeRawData(hTransactions, 60, hLastTime, hLastValue);
      const existingHourChart = await this.chartModel.findOne({ cropData });
      if (existingHourChart) {
        existingHourChart.column.push(...hColumn!);
        await existingHourChart.save();
      } else {
        const chart = new this.chartModel({ cropData, hColumn, name });
        await chart.save();
      }

      const cropsData = await this.getCropChartData(cropId, 'H');
      const cropHourChartData = { cropHourData: cropsData };
      this.webSocketGateway.chartHourDataTransfer(cropId, cropHourChartData);
    }
  }

  async onModuleInit() {
    const isExist = await this.chartModel.findOne();
    if (!isExist) {
      console.log('차트 데이터를 초기 생성합니다.');
      await this.checkSituation();
    } else {
      console.log('이미 있당게요.');
      await this.checkSituationFrom();
    }
  }

  async checkSituation() {
    const cropIds = (await this.databaseService.query(chartQueries.getCrops, [])).rows;
    for (const cd of cropIds) {
      const cropId = cd.crop_id;
      const transactions = (
        await this.databaseService.query(chartQueries.getAllTransactionsData, [cropId])
      ).rows;
      const mColumn = await this.makeRawData(transactions);
      let cropData = `M${cropId}`;
      const mChart = new this.chartModel({ cropData, mColumn, name });
      await mChart.save();

      const hColumn = await this.makeRawData(transactions, 60);
      cropData = `H${cropId}`;
      const hChart = new this.chartModel({ cropData, hColumn, name });
      await hChart.save();
    }
  }

  async checkSituationFrom() {
    const cropIds = (await this.databaseService.query(chartQueries.getCrops, [])).rows;
    for (const cd of cropIds) {
      const cropId = cd.crop_id;

      let cropData = `M${cropId}`;
      const minuteLastChart = await this.chartModel
        .findOne({ cropData })
        .sort({ 'column.x': -1 })
        .select('column');
      const mLastTime = minuteLastChart?.column[minuteLastChart.column.length - 1].x;
      const mLastValue = minuteLastChart?.column[minuteLastChart.column.length - 1].y;
      const mTransactions = (
        await this.databaseService.query(chartQueries.getAllTransactionUpperTime, [
          cropId,
          mLastTime?.toISOString()
        ])
      ).rows;
      const mColumn = await this.makeRawData(mTransactions, 1, mLastTime, mLastValue);
      const existingMinuteChart = await this.chartModel.findOne({ cropData });
      if (existingMinuteChart) {
        existingMinuteChart.column.push(...mColumn!);
        await existingMinuteChart.save();
      } else {
        const chart = new this.chartModel({ cropData, mColumn, name });
        await chart.save();
      }

      cropData = `H${cropId}`;
      const hourLastChart = await this.chartModel
        .findOne({ cropData })
        .sort({ 'column.x': -1 })
        .select('column');
      const hLastTime = hourLastChart?.column[hourLastChart.column.length - 1].x;
      const hLastValue = hourLastChart?.column[hourLastChart.column.length - 1].y;
      const hTransactions = (
        await this.databaseService.query(chartQueries.getAllTransactionUpperTime, [
          cropId,
          hLastTime?.toISOString()
        ])
      ).rows;
      const hColumn = await this.makeRawData(hTransactions, 60, hLastTime, hLastValue);
      const existingHourChart = await this.chartModel.findOne({ cropData });
      if (existingHourChart) {
        existingHourChart.column.push(...hColumn!);
        await existingHourChart.save();
      } else {
        const chart = new this.chartModel({ cropData, hColumn, name });
        await chart.save();
      }
    }
  }

  async makeRawData(
    transactions: any[],
    factor: number = 1,
    startDate: Date = new Date('2024-12-01T00:00:00'),
    value: number = 500
  ) {
    const column = await this.generateColumnData(startDate, transactions, factor, value);
    return column;
  }

  async generateColumnData(
    startDate: Date,
    transactions: any[],
    factor: number,
    lastValue: number
  ) {
    const startTime = startDate;
    const endTime = new Date(); // 현재 시간
    const columnData = [];

    let currentTime = new Date(startTime);
    let yValue = lastValue;

    while (currentTime <= endTime) {
      const transactionsForMinute = transactions.filter(transaction => {
        const transactionTime = new Date(transaction.created_at);
        return (
          transactionTime.getUTCFullYear() === currentTime.getUTCFullYear() &&
          transactionTime.getUTCMonth() === currentTime.getUTCMonth() &&
          transactionTime.getUTCDate() === currentTime.getUTCDate() &&
          transactionTime.getUTCHours() === currentTime.getUTCHours() &&
          transactionTime.getUTCMinutes() === currentTime.getUTCMinutes()
        );
      });
      // 해당 1분에 transaction이 없으면 y = 500

      if (transactionsForMinute.length > 0) {
        // transaction이 여러개 있으면 마지막 transaction의 가격을 선택
        const latestTransaction = transactionsForMinute[transactionsForMinute.length - 1];
        yValue = latestTransaction.price;
      }

      columnData.push({
        x: new Date(currentTime),
        y: yValue
      });

      currentTime = new Date(currentTime.getTime() + factor * 60 * 1000);
    }

    return columnData;
  }

  async getCropChartData(cropId: number, timeUnit: string) {
    const cropData = `${timeUnit}${cropId}`;
    const chart = await this.chartModel.findOne({ cropData }).select('column').exec();
    return chart ? chart.column : null;
  }
}
