import { Injectable } from '@nestjs/common';
import { AccountRepository } from './account.repository';
import { AccountCashDto } from './dto/accountCash.dto';
import { OrderType } from '../order/enums/orderType';
import { AccountCropDto } from './dto/accountCrop.dto';

@Injectable()
export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async getCashFromMemberId(memberId: number): Promise<AccountCashDto> {
    return await this.accountRepository.getCashFromMemberId(memberId);
  }

  async updateCashByPlacingOrder(
    memberId: number,
    total_price: number,
    orderType: OrderType
  ): Promise<void> {
    return await this.accountRepository.updateCashByPlacingOrder(orderType, memberId, total_price);
  }

  async updateCashByCompletingOrder(
    memberId: number,
    total_price: number,
    orderType: OrderType
  ): Promise<void> {
    return await this.accountRepository.updateCashByCompletingOrder(
      orderType,
      memberId,
      total_price
    );
  }

  async updateCropByPlacingSellOrder(
    memberId: number,
    cropId: number,
    quantity: number
  ): Promise<void> {
    return await this.accountRepository.updateCropByPlacingSellOrder(memberId, cropId, quantity);
  }

  async updateCropByCompletingSellOrder(
    memberId: number,
    cropId: number,
    quantity: number
  ): Promise<void> {
    return await this.accountRepository.updateCropByCompletingSellOrder(memberId, cropId, quantity);
  }

  async updateCropByCompletingBuyOrder(
    memberId: number,
    cropId: number,
    quantity: number
  ): Promise<void> {
    return await this.accountRepository.updateCropByCompletingBuyOrder(memberId, cropId, quantity);
  }

  async getCropFromMemberId(memberId: number, cropId: number): Promise<AccountCropDto> {
    return await this.accountRepository.getCropByMemberId(memberId, cropId);
  }

  async getAvailableCropsFromMemberId(memberId: number): Promise<AccountCropDto[]> {
    return await this.accountRepository.getAvailableCropsByMemberId(memberId);
  }

  async getTotalCropsFromMemberId(memberId: number): Promise<AccountCropDto[]> {
    return await this.accountRepository.getTotalCropsByMemberId(memberId);
  }

  async rollbackPendingCrop(cropId: number, memberId: number, quantity: number): Promise<void> {
    await this.accountRepository.decrementPendingCrop(memberId, cropId, quantity);
  }

  async rollbackPendingCash(memberId: number, amount: number): Promise<void> {
    await this.accountRepository.incrementCash(memberId, amount);
  }
}
