import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { DatabaseService } from 'src/database/database.service';
import { rankQueries } from './rank.queries';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class RankService {
  constructor(
    private readonly databaseService: DatabaseService,
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType
  ) {}

  async onApplicationBootstrap() {
    await this.storeMoneyRanking();
  }

  @Cron(CronExpression.EVERY_2ND_HOUR)
  async handleCron() {
    await this.storeMoneyRanking();
  }

  async storeMoneyRanking() {
    await this.redisClient.del('ranking');
    const membersMoney = await this.databaseService.query(rankQueries.moneyDataQuery);
    const pipeline = this.redisClient.multi();
    for (const memberMoney of membersMoney.rows) {
      pipeline.zAdd('ranking', {
        score: memberMoney.total_asset,
        value: memberMoney.nickname
      });
    }
    await pipeline.exec();
  }

  async getTopRankings() {
    const members = await this.redisClient.zRangeWithScores('ranking', -5, -1);
    return members.reverse();
  }

  async getRanking(nickname: string) {
    const rank = await this.redisClient.zRevRank('ranking', nickname);
    const totalmembers = await this.redisClient.zCard('ranking');
    if (typeof rank !== 'number') return { rank: -1, percentage: null };
    const percentage = ((rank + 1) / totalmembers) * 100;
    return { rank: rank + 1, percentage: percentage == 0 ? 1 : percentage.toFixed(0) };
  }
}
