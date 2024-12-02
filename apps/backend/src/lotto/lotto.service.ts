import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { lottoQueries } from './lotto.queries';
import * as seedrandom from 'seedrandom';
import { ConfigService } from '@nestjs/config';
import { InningUtil } from './model/util.mongo';

@Injectable()
export class LottoService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly configService: ConfigService,
    private readonly inningUtil: InningUtil
  ) {}

  async buyLotto(memberId: number) {
    const memberCash = (await this.databaseService.query(lottoQueries.getMemberCash, [memberId]))
      .rows[0].available_cash;
    if (memberCash < 1000) {
      throw new HttpException(
        `구매자의 자본금이 복권 최소 금액 보다 적습니다. 자본금 : ${memberCash}`,
        HttpStatus.BAD_REQUEST
      );
    }

    let unsoldData = (await this.databaseService.query(lottoQueries.getRemainTickets)).rows[0];
    if (!unsoldData) {
      await this.resetLotto();
      unsoldData = await this.getUnsoldTickets();
    }

    const totalTickets = this.calculateTotalTickets(unsoldData);
    if (totalTickets === 0) {
      await this.resetLotto();
      unsoldData = await this.getUnsoldTickets();
    }

    const rank = this.determineRank(unsoldData, totalTickets);
    if (rank === 0) {
      throw new HttpException('복권 등수 계산에 실패했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const updatedCash = this.calculateNewCash(memberCash, rank);
    await this.updateGameRecords(memberId, rank, unsoldData);
    await this.updateMemberCash(memberId, updatedCash);
    await this.inningUtil.addLottoLog(
      unsoldData.inning_id,
      memberId,
      1001 - totalTickets,
      new Date()
    );

    return this.createResponse(rank, updatedCash);
  }

  private async resetLotto() {
    await this.databaseService.query(lottoQueries.insertNewTickets);
  }

  private async getUnsoldTickets() {
    const data = await this.databaseService.query(lottoQueries.getRemainTickets);
    return data.rows[0];
  }

  private calculateTotalTickets(data: any): number {
    return (
      data.first_count + data.second_count + data.third_count + data.fourth_count + data.fifth_count
    );
  }

  private determineRank(unsoldData: any, totalTickets: number): number {
    const rng = seedrandom(
      `${this.configService.get<string>('LOTTO_SEED')}+${totalTickets}+${unsoldData.inning_id}`
    );
    const myChance = Math.floor(rng() * totalTickets) + 1;

    let cumulativeTickets = 0;
    const ranks = [
      { count: unsoldData.first_count, rank: 1 },
      { count: unsoldData.second_count, rank: 2 },
      { count: unsoldData.third_count, rank: 3 },
      { count: unsoldData.fourth_count, rank: 4 },
      { count: unsoldData.fifth_count, rank: 5 }
    ];

    for (const { count, rank } of ranks) {
      cumulativeTickets += count;
      if (myChance <= cumulativeTickets) {
        return rank;
      }
    }
    return 0;
  }

  private calculateNewCash(memberCash: number, rank: number): number {
    const prize: Record<number, number> = {
      1: 400000,
      2: 45000,
      3: 10000,
      4: 500,
      5: 0
    };
    return memberCash - 1000 + (prize[rank] || 0);
  }

  private async updateGameRecords(memberId: number, rank: number, unsoldData: any) {
    const prizeColumn = this.getPrizeColumn(rank);
    const remainingTickets = Number(unsoldData[prizeColumn] - 1);

    // Update ticket count in the inning
    await this.databaseService.query(`UPDATE inning SET ${prizeColumn} = $1 WHERE inning_id = $2`, [
      remainingTickets,
      unsoldData.inning_id
    ]);

    // Update member's lotto history
    await this.databaseService.query(
      `UPDATE lottos SET ${prizeColumn} = ${prizeColumn} + 1 WHERE member_id = $1`,
      [memberId]
    );
  }

  private async updateMemberCash(memberId: number, updatedCash: number) {
    await this.databaseService.query(lottoQueries.setMemberCash, [updatedCash, memberId]);
  }

  private getPrizeColumn(rank: number): string {
    const prizeColumns: Record<number, string> = {
      1: 'first_count',
      2: 'second_count',
      3: 'third_count',
      4: 'fourth_count',
      5: 'fifth_count'
    };
    return prizeColumns[rank];
  }

  private createResponse(rank: number, remainCash: number) {
    return {
      rank,
      remainCash,
      time: new Date()
    };
  }
}
