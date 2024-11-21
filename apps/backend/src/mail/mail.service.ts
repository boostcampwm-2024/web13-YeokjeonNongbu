import { HttpException, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Response } from 'express';
import { DatabaseService } from 'src/database/database.service';
import { mailQueries } from './mail.queries';
import { successhandler, successMessage } from 'src/global/successhandler';
import { map, BehaviorSubject } from 'rxjs';

@Injectable()
export class MailService {
  constructor(private readonly databaseService: DatabaseService) {}
  private sseSubjects: Map<string, BehaviorSubject<string>> = new Map();

  async connectSseAndInitiate(req: any, res: Response) {
    const memberId = req.user.memberId;
    const checkUnread = await this.databaseService.query(mailQueries.checkUnreadQuery, [memberId]);
    const data = {
      check: checkUnread.rows[0].result,
      time: new Date()
    };
    const body = successhandler(successMessage.GET_MAIL_ALARM_SUCCESS, data);

    if (!this.sseSubjects.has(memberId)) {
      const newSubject = new BehaviorSubject<string>(JSON.stringify(body));
      this.sseSubjects.set(memberId, newSubject);
    }

    const userSubject = this.sseSubjects.get(memberId);
    if (!userSubject) {
      throw new Error('유저 서브젝트가 제대로 생성되지 않았습니다.');
    }

    res.on('close', () => {
      this.sseSubjects.delete(memberId);
      res.end();
    });

    return userSubject.asObservable().pipe(map(message => ({ data: message })));
  }

  @OnEvent('sendAlarm')
  handleAlarmEventObs(memberId: string) {
    const userSubject = this.sseSubjects.get(memberId);

    if (userSubject) {
      const data = {
        check: true,
        time: new Date()
      };
      const body = successhandler(successMessage.GET_MAIL_ALARM_SUCCESS, data);
      userSubject.next(JSON.stringify(body));
    } else {
      throw new Error(`잘못된 알람 생성 요청입니다.`);
    }
  }

  async getMailsByMemberId(memberId: string) {
    try {
      const response = await this.databaseService.query(mailQueries.getAllMailQuery, [memberId]);
      return response.rows;
    } catch (error) {
      throw new HttpException('메일 기록을 가져오는 도중에 에러 발생 : ', error);
    }
  }

  async deleteAllMailByMemberId(memberId: string) {
    try {
      const response = await this.databaseService.query(mailQueries.deleteMailQuery, [memberId]);
      return response;
    } catch (error) {
      throw new HttpException('메일 기록을 삭제하는 도중에 에러 발생 : ', error);
    }
  }
}
