import { Injectable } from '@nestjs/common';

@Injectable()
export class MailCreateUtil {
  constructor() {}

  private readonly templates: Record<number, (params: string[]) => string> = {
    1: ([item, price, quantity]) => `${item}을(를) ${price}원에 ${quantity}개 매수했습니다.`,
    2: ([item, price, quantity]) => `${item}을(를) ${price}원에 ${quantity}개 매도했습니다.`,
    3: params => `${params[params.length - 1]}`,
    4: ([user, rank]) => `${user}님이 복권을 구매하여 ${rank}등에 당첨됐습니다.`,
    5: ([user]) => `${user}님께서 당신의 농장에 방문하셨습니다.`,
    6: ([rank]) => `${rank}등을 달성하셨습니다.`,
    7: ([user, total]) => `${user}님께서 총 자산 ${total}원에 도달하셨습니다.`
  };

  async createMailString(action: number, ...args: (string | string[])[]): Promise<string> {
    const templateFn = this.templates[action];
    if (!templateFn) {
      throw new Error(`Invalid action type: ${action}`);
    }

    const params = Array.isArray(args[0]) ? args[0] : args;
    return templateFn(params as string[]);
  }
}
