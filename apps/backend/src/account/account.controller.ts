import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AccountService } from './account.service';
import { ApiOperation } from '@nestjs/swagger';
import {
  accountCashDecorator,
  accountCropDecorator,
  accountCropsDecorator,
  accountCropValueDecorator
} from './decorator/account.decorator';
import { successhandler, successMessage } from '../global/successhandler';
import { User } from '../global/utils/memberData';
import { MarketService } from '../market/market.service';

@Controller('api/account')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly marketService: MarketService
  ) {}

  @Get('cash')
  @ApiOperation({ summary: '회원의 현금 정보 조회' })
  @accountCashDecorator()
  async getCashFromMemberId(@User() user: { memberId: number }) {
    const { memberId } = user;
    const cash = await this.accountService.getCashFromMemberId(memberId);
    return successhandler(successMessage.GET_ACCOUNT_CASH_SUCCESS, cash);
  }

  @Get('crops/value')
  @ApiOperation({ summary: '회원의 총 보유 작물 가치 조회' })
  @accountCropValueDecorator()
  async getCropsValueFromMemberId(@User() user: { memberId: number }) {
    const { memberId } = user;
    const cropsByMember = await this.accountService.getCropsFromMemberId(memberId);
    const cropPrices = await this.marketService.getAllCropPrices();
    const data = cropsByMember.reduce((acc, crop) => {
      const cropData = cropPrices.find(cropData => cropData.cropId === crop.cropId);

      if (!cropData) {
        return acc;
      } else {
        return acc + cropData.price * crop.quantity;
      }
    }, 0);

    const totalValue = { value: data };
    return successhandler(successMessage.GET_ACCOUNT_CROP_VALUE_SUCCESS, totalValue);
  }

  @Get('crop/:cropId')
  @ApiOperation({ summary: '회원의 보유 작물 정보 조회' })
  @accountCropDecorator()
  async getCropFromMemberId(
    @User() user: { memberId: number },
    @Param('cropId', ParseIntPipe) cropId: number
  ) {
    const { memberId } = user;
    const crop = await this.accountService.getCropFromMemberId(memberId, cropId);
    return successhandler(successMessage.GET_ACCOUNT_CROP_SUCCESS, crop);
  }

  @Get('crops')
  @ApiOperation({ summary: '회원의 전체 보유 작물 정보 조회' })
  @accountCropsDecorator()
  async getCropsFromMemberId(@User() user: { memberId: number }) {
    const { memberId } = user;
    const cropInfo = await this.marketService.getCropsInfo();
    const cropsByMember = await this.accountService.getCropsFromMemberId(memberId);

    const crops = cropInfo.map(crop => {
      const memberCrop = cropsByMember.find(memberCrop => memberCrop.cropId === crop.cropId);
      return {
        ...crop,
        quantity: memberCrop?.quantity || 0
      };
    });
    return successhandler(successMessage.GET_ACCOUNT_CROP_SUCCESS, crops);
  }
}
