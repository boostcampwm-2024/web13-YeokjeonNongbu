import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleDestroy,
  OnModuleInit
} from '@nestjs/common';
import { Response } from 'express';
import { DatabaseService } from 'src/database/database.service';
import { mailQueries } from './mail.queries';
import { successhandler, successMessage } from 'src/global/successhandler';
import { map, BehaviorSubject } from 'rxjs';
import { createClient, RedisClientType } from 'redis';
import { ConfigService } from '@nestjs/config';
import * as os from 'os';
import { MailCreateUtil } from './util/mailCreateUtil';
import { Nullable } from 'src/global/utils/dataCustomType';

@Injectable()
export class MailService implements OnModuleInit, OnModuleDestroy {
  private subscriber: RedisClientType;
  private publisher: RedisClientType;
  private sseSubjects: Map<number, BehaviorSubject<string>> = new Map();
  private myIp: string;
  private intervalConnect: NodeJS.Timeout;

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly configService: ConfigService,
    private readonly mailCreateUtil: MailCreateUtil
  ) {}

  onModuleDestroy() {
    const keys = this.sseSubjects.keys();
    for (const key in keys) {
      this.publisher.del(key);
    }

    if (this.intervalConnect) {
      clearInterval(this.intervalConnect);
    }
  }

  async onModuleInit() {
    await this.initializeRedisClients();
    this.myIp = await this.getLocalIpAddress();

    this.subscriber.subscribe('notifications', message => {
      this.handleNotification(message);
    });

    this.startSendPeriodicChecks();
  }

  async connectSse(memberId: number, res: Response) {
    const checkUnread = (await this.databaseService.query(mailQueries.checkUnreadQuery, [memberId]))
      .rows[0].result;

    if (!this.sseSubjects.has(memberId)) {
      this.sseSubjects.set(
        memberId,
        new BehaviorSubject<string>(this.createNotificationPayload(checkUnread))
      );
    }

    const userSubject = this.sseSubjects.get(memberId);
    if (!userSubject) {
      throw new HttpException(
        '유저 서브젝트가 제대로 생성되지 않았습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    await this.publisher.set(`sseRedisMember:${memberId}`, this.myIp);

    res.on('close', () => {
      this.sseSubjects.delete(memberId);
      this.publisher.del(`sseRedisMember:${memberId}`);
      res.end();
    });

    return userSubject.asObservable().pipe(map(message => ({ data: message })));
  }

  async sendMessage(memberId: number) {
    const targetIp = await this.publisher.get(`sseRedisMember:${memberId}`);
    if (!targetIp) {
      return;
    }

    const isLocal = targetIp === this.myIp;
    const subject = this.sseSubjects.get(memberId);

    if (isLocal && subject) {
      subject.next(this.createNotificationPayload(true));
    } else {
      await this.publisher.publish('notifications', JSON.stringify({ memberId }));
    }
  }

  async getMailsByMemberId(memberId: number) {
    const response = await this.databaseService.query(mailQueries.getAllMailQuery, [memberId]);
    const processedMails = await Promise.all(response.rows.map(mail => this.formatMail(mail)));

    await this.databaseService.query(mailQueries.makeReadedQuery, [memberId]);
    return processedMails;
  }

  async deleteAllMailByMemberId(memberId: number) {
    try {
      await this.databaseService.query(mailQueries.deleteMailQuery, [memberId]);
    } catch (error) {
      throw new HttpException('메일 기록을 삭제하는 도중에 에러 발생 : ', error);
    }
  }

  private async initializeRedisClients() {
    const redisUrl = this.configService.get<string>('REDIS_URL');
    this.subscriber = createClient({ url: redisUrl });
    this.publisher = createClient({ url: redisUrl });
    await Promise.all([this.subscriber.connect(), this.publisher.connect()]);
  }

  private getLocalIpAddress() {
    const networkInterfaces = os.networkInterfaces();
    for (const interfaceName in networkInterfaces) {
      const networkInfo = networkInterfaces[interfaceName];
      const ipv4 = networkInfo?.find(info => info.family === 'IPv4' && !info.internal);
      if (ipv4) return ipv4.address;
    }
    throw new Error('Local IP address not found');
  }

  private handleNotification(msg: string) {
    const parsedMessage = JSON.parse(msg);
    const memberId = parsedMessage.memberId;
    if (this.sseSubjects.has(memberId)) {
      const data = {
        check: true,
        time: new Date()
      };
      const body = successhandler(successMessage.GET_MAIL_ALARM_SUCCESS, data);
      this.sseSubjects.get(memberId)?.next(JSON.stringify(body));
    }
  }

  private startSendPeriodicChecks() {
    this.intervalConnect = setInterval(() => {
      this.sseSubjects.forEach(subject => subject.next('Periodically Check Response'));
    }, 30000); // 30 seconds
  }

  private createNotificationPayload(hasUnread: boolean): string {
    const data = {
      check: hasUnread,
      time: new Date()
    };
    return JSON.stringify(successhandler(successMessage.GET_MAIL_ALARM_SUCCESS, data));
  }

  private async formatMail(mail: any) {
    const {
      mail_id: mailId,
      action,
      param1,
      param2,
      param3,
      content,
      created_at: createdAt,
      read_status: readStatus
    } = mail;

    const formattedContent = await this.mailCreateUtil.createMailString(
      action,
      await this.getActionParam(action, param1),
      param2,
      param3,
      content
    );

    return { mailId, content: formattedContent, createdAt, readStatus };
  }

  private async getActionParam(action: number, param1: Nullable<number>) {
    if ([1, 2].includes(action)) {
      const result = await this.databaseService.query(mailQueries.getCropName, [param1]);
      return result.rows[0]?.crop_name || '';
    } else if ([4, 5, 7].includes(action)) {
      const result = await this.databaseService.query(mailQueries.getMemberNickNameByMemberID, [
        param1
      ]);
      return result.rows[0]?.nickname || '';
    }
    return '';
  }

  public async createMailByOtherService(
    member_id: number,
    action: number,
    param1: Nullable<number> = null,
    param2: Nullable<number> = null,
    param3: Nullable<number> = null,
    content: Nullable<string> = null
  ) {
    await this.databaseService.query(mailQueries.InsertMailQuery, [
      member_id,
      action,
      param1,
      param2,
      param3,
      content
    ]);

    this.sendMessage(member_id);
  }
}
