import { DatabaseService } from '../database/database.service';
import { Injectable } from '@nestjs/common';
import { AccountCashDto } from './dto/accountCash.dto';
import { OrderType } from '../order/enums/orderType';
import { AccountCropDto } from './dto/accountCrop.dto';

@Injectable()
export class AccountRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async getCashFromMemberId(memberId: number): Promise<AccountCashDto> {
    const query = `
            SELECT available_cash, pending_cash, total_cash
            FROM members
            WHERE member_id = $1
        `;

    const values = [memberId];

    const result = await this.databaseService.query(query, values);
    return {
      availableCash: result.rows[0].available_cash,
      pendingCash: result.rows[0].pending_cash,
      totalCash: result.rows[0].total_cash
    };
  }

  async updateCashByPlacingOrder(
    orderType: OrderType,
    memberId: number,
    total_price: number
  ): Promise<void> {
    if (total_price <= 0) {
      throw new Error('주문 금액은 0보다 커야 합니다.');
    }

    const query = `
            UPDATE members
            SET available_cash = available_cash - $1,
                pending_cash   = pending_cash + $1
            WHERE member_id = $2
        `;

    const values = [total_price, memberId];
    await this.databaseService.query(query, values);
  }

  async updateCashByCompletingOrder(
    orderType: OrderType,
    memberId: number,
    total_price: number
  ): Promise<void> {
    let query = ``;
    if (orderType === OrderType.BUY) {
      query = `
                UPDATE members
                SET pending_cash = pending_cash - $1
                WHERE member_id = $2
            `;
    } else if (orderType === OrderType.SELL) {
      query = `
                UPDATE members
                SET available_cash = available_cash + $1
                WHERE member_id = $2
            `;
    }

    const values = [total_price, memberId];
    await this.databaseService.query(query, values);
  }

  async updateCropByPlacingSellOrder(
    memberId: number,
    cropId: number,
    quantity: number
  ): Promise<void> {
    const query = `
            UPDATE member_crops
            SET available_quantity = available_quantity - $3,
                pending_quantity   = pending_quantity + $3
            WHERE member_id = $1
              AND crop_id = $2
        `;

    const values = [memberId, cropId, quantity];
    await this.databaseService.query(query, values);
  }

  async updateCropByCompletingSellOrder(
    memberId: number,
    cropId: number,
    quantity: number
  ): Promise<void> {
    const query = `
            UPDATE member_crops
            SET pending_quantity = pending_quantity - $3
            WHERE member_id = $1
              AND crop_id = $2
        `;

    const values = [memberId, cropId, quantity];
    await this.databaseService.query(query, values);
  }

  async updateCropByCompletingBuyOrder(
    memberId: number,
    cropId: number,
    quantity: number
  ): Promise<void> {
    const query = `
            INSERT INTO member_crops (member_id, crop_id, available_quantity)
            VALUES ($1, $2, $3) ON CONFLICT (member_id, crop_id)
    DO
            UPDATE SET available_quantity = member_crops.available_quantity + $3
        `;

    const values = [memberId, cropId, quantity];
    await this.databaseService.query(query, values);
  }

  async getCropByMemberId(memberId: number, cropId: number): Promise<AccountCropDto> {
    const query = `
            SELECT crop_id, available_quantity
            FROM member_crops
            WHERE member_id = $1
              AND crop_id = $2
        `;

    const values = [memberId, cropId];

    const result = await this.databaseService.query(query, values);

    if (!result || result.rows.length === 0) {
      return {
        cropId: cropId,
        quantity: 0
      };
    }
    return {
      cropId: cropId,
      quantity: result.rows[0].available_quantity || 0
    };
  }

  async getCropsByMemberId(memberId: number): Promise<AccountCropDto[]> {
    const query = `
            SELECT crop_id, available_quantity
            FROM member_crops
            WHERE member_id = $1
        `;

    const values = [memberId];

    const result = await this.databaseService.query(query, values);
    return result.rows.map(row => ({
      cropId: row.crop_id,
      quantity: row.available_quantity
    }));
  }

  async decrementPendingCrop(memberId: number, cropId: number, quantity: number): Promise<void> {
    if (quantity <= 0) {
      throw new Error('반드시 0보다 큰 값을 감소해야 합니다.');
    }
    const query = `
            UPDATE member_crops
            SET pending_quantity   = GREATEST(pending_quantity - $1, 0),
                available_quantity = available_quantity + $1
            WHERE member_id = $2
              AND crop_id = $3
        `;
    const values = [quantity, memberId, cropId];
    await this.databaseService.query(query, values);
  }

  async incrementCash(memberId: number, amount: number): Promise<void> {
    if (amount <= 0) {
      throw new Error('반드시 0보다 큰 값을 증가해야 합니다.');
    }

    const query = `
            UPDATE members
            SET available_cash = available_cash + $1,
                pending_cash   = pending_cash - $1
            WHERE member_id = $2
        `;
    const values = [amount, memberId];
    await this.databaseService.query(query, values);
  }
}
