import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { AccountService } from '../account.service';

@Injectable()
export class HasSufficientCashGuard implements CanActivate {
  constructor(private readonly accountService: AccountService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const { memberId } = user;
    const { tradingType, price, quantity, totalAmount } = request.body;

    let hasEnoughCash = false;
    // 지정가 주문 확인
    if (tradingType === 'limit') {
      hasEnoughCash = await this.canLimitBuyOrder(price, memberId, quantity);
    } else if (tradingType === 'market') {
      hasEnoughCash = await this.canMarketBuyOrder(totalAmount, memberId);
    }

    if (!hasEnoughCash) {
      throw new ForbiddenException('사용 가능한 현금이 부족합니다.');
    }

    return true;
  }

  async canLimitBuyOrder(price: number, memberId: number, quantity: number): Promise<boolean> {
    const total_price = price * quantity;
    const memberCash = await this.accountService.getCashFromMemberId(memberId);
    const availableCash = memberCash.availableCash;
    return availableCash >= total_price;
  }

  async canMarketBuyOrder(totalAmount: number, memberId: number): Promise<boolean> {
    const memberCash = await this.accountService.getCashFromMemberId(memberId);
    const availableCash = memberCash.availableCash;
    return availableCash >= totalAmount;
  }
}
