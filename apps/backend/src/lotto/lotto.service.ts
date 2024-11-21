import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { lottoQueries } from './lotto.queries';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import seedrandom = require('seedrandom');

@Injectable()
export class LottoService {
  constructor(private readonly databaseService: DatabaseService) {}

  async buyLotto(memberId: number) {
    const data = await this.databaseService.query(lottoQueries.getMemberCash, [memberId]);
    let memberCash = Number(data.rows[0].available_cash);
    const prize: Record<number, [number, string]> = {
      1: [500000, 'first_count'],
      2: [200000, 'second_count'],
      3: [140000, 'third_count'],
      4: [100000, 'fourth_count'],
      5: [0, 'fifth_count']
    };

    const memberHistory = await this.databaseService.query(lottoQueries.findLottoHistory, [
      memberId
    ]);
    if (memberHistory.rows.length == 0) {
      await this.databaseService.query(lottoQueries.startLottoCount, [memberId]);
    }

    if (memberCash < 1000) {
      throw new HttpException(
        `구매자의 자본금이 복권 최소 금액 보다 적습니다. 자본금 : ${memberCash}`,
        HttpStatus.BAD_REQUEST
      );
    }

    let unsoldData = (await this.databaseService.query(lottoQueries.getRemainTickets)).rows[0];
    const remainCheck = Object.entries(unsoldData)
      .filter(([key]) => key !== 'inning_id')
      .every(([, value]) => value === 0);

    if (remainCheck || !unsoldData) {
      await this.resetLotto();
      unsoldData = (await this.databaseService.query(lottoQueries.getRemainTickets)).rows[0];
    }

    // 각각의 확률 계산하기
    const total =
      unsoldData.first_count +
      unsoldData.second_count +
      unsoldData.third_count +
      unsoldData.fourth_count +
      unsoldData.fifth_count;

    const rng = seedrandom('my-seed');
    const myChance = Math.floor(rng() * total) + 1;

    let step = 0;
    let rank = 0;
    const ranks = [
      { count: unsoldData.first_count, rank: 1 },
      { count: unsoldData.second_count, rank: 2 },
      { count: unsoldData.third_count, rank: 3 },
      { count: unsoldData.fourth_count, rank: 4 },
      { count: unsoldData.fifth_count, rank: 5 }
    ];

    // 확률 도출해서 이번에 몇등인지 계산하기
    for (const { count, rank: r } of ranks) {
      step += count;
      if (myChance <= step) {
        rank = r;
        break; // 일치하는 랭크를 찾으면 루프 종료
      }
    }

    if (rank == 0) {
      throw new HttpException(
        `확률을 계산하던 중 문제가 발생했습니다.`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    // 등수에 따라서 현금 계산하기
    memberCash = memberCash - 1000 + prize[rank][0];

    //위 모든행위를 다시 저장하기
    const updateInningQuery = `UPDATE inning SET ${prize[rank][1]} = $1 WHERE inning_id = $2`;
    const remainCount = ranks[rank - 1].count - 1;
    // 긁은 복권 저장
    await this.databaseService.query(updateInningQuery, [remainCount, unsoldData.inning_id]);
    // 멤버의 현금 저장
    await this.databaseService.query(lottoQueries.setMemberCash, [memberCash, memberId]);

    // 멤버의 복권 당첨 현황 업데이트
    const updateLottosQuery = `UPDATE lottos SET ${prize[rank][1]} = ${prize[rank][1]} + 1 WHERE member_id = $1`;
    await this.databaseService.query(updateLottosQuery, [memberId]);

    //결과 말아서 리턴해주기
    const responseData = {
      rank: rank,
      remainCash: memberCash,
      time: new Date()
    };

    return responseData;
  }

  async resetLotto() {
    await this.databaseService.query(lottoQueries.insertNewTickets);
  }
}
