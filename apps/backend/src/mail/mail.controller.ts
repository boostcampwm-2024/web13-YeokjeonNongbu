import { Controller, Delete, Get, Res, Sse } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MailService } from './mail.service';
import { Response } from 'express';
import { successhandler, successMessage } from 'src/global/successhandler';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { checkResponseDecorator } from './decorator/check.decorator';
import { deleteMailResponseDecorator, mailResponseDecorator } from './decorator/mail.decorator';
import { User } from 'src/global/utils/memberData';

@Controller('api/mail')
@ApiBearerAuth()
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @Sse('check')
  @ApiOperation({ summary: '알림 연결 요청 API' })
  @checkResponseDecorator()
  initialConnectSse(@User() user: { memberId: number }, @Res() res: Response) {
    const { memberId } = user;
    return this.mailService.connectSse(memberId, res);
  }

  @Get('call')
  @ApiOperation({ summary: '알림 강제 발생 API(토큰만 넣으세요)' })
  triggerAlarm(@User() user: { memberId: number }) {
    const { memberId } = user;
    this.mailService.sendMessage(memberId);
  }

  @Get()
  @ApiOperation({ summary: '알림 조회 요청 API' })
  @mailResponseDecorator()
  async getMailsByMemberId(@User() user: { memberId: number }) {
    const { memberId } = user;
    const data = await this.mailService.getMailsByMemberId(memberId);
    return successhandler(successMessage.GET_MAIL_SUCCESS, data);
  }

  @Delete()
  @deleteMailResponseDecorator()
  @ApiOperation({ summary: '알림 삭제 요청 API' })
  async deleteMailsByMemberId(@User() user: { memberId: number }) {
    const { memberId } = user;
    await this.mailService.deleteAllMailByMemberId(memberId);
    return successhandler(successMessage.DELETE_MAIL_SUCCESS);
  }
}
