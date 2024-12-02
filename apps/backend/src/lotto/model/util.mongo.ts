import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inning } from './lotto.schema';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class InningUtil {
  constructor(@InjectModel(Inning.name) private readonly inningModel: Model<Inning>) {}

  async addLottoLog(inningId: number, memberId: number, sequence: number, createAt: Date) {
    try {
      const existingInning = await this.inningModel.findOne({ inningId }).exec();

      if (existingInning) {
        await this.inningModel.updateOne(
          { inningId },
          {
            $push: {
              logs: { memberId, sequence, createAt }
            }
          }
        );
        return { message: 'New Log added to existring inning' };
      } else {
        const newInning = new this.inningModel({
          inningId,
          logs: [{ memberId, sequence, createAt }],
          name: `Inning_${inningId}`
        });
        await newInning.save();
        return { message: 'New Inning created with log' };
      }
    } catch (error) {
      throw new HttpException(
        `몽고디비 데이터 삽입 중 에러 발생 : ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
