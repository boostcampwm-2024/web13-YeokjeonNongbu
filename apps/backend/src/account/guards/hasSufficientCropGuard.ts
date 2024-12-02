import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { AccountService } from '../account.service';

@Injectable()
export class HasSufficientCropGuard implements CanActivate {
  constructor(private readonly accountService: AccountService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const { memberId } = user;
    const { tradingType, cropId, quantity } = request.body;

    let hasEnoughCrop = false;
    // 지정가 주문 확인
    if (tradingType === 'limit') {
      hasEnoughCrop = await this.canLimitSellOrder(cropId, memberId, quantity);
    } else if (tradingType === 'market') {
      hasEnoughCrop = await this.canMarketSellOrder(cropId, memberId, quantity);
    }

    if (!hasEnoughCrop) {
      throw new ForbiddenException('작물을 충분히 보유하고 있지 않습니다.');
    }

    return true;
  }

  async canLimitSellOrder(cropId: number, memberId: number, quantity: number): Promise<boolean> {
    const memberCrop = await this.accountService.getCropFromMemberId(memberId, cropId);
    const memberQuantity = memberCrop.quantity;
    return memberQuantity >= quantity;
  }

  async canMarketSellOrder(cropId: number, memberId: number, quantity: number): Promise<boolean> {
    const memberCrop = await this.accountService.getCropFromMemberId(memberId, cropId);
    const memberQuantity = memberCrop.quantity;
    return memberQuantity >= quantity;
  }
}
