import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderBookService } from './orderBook.service';
import DtoTransformer from './utils/dtoTransformer';
import { LimitOrderDto } from './dto/limitOrder.dto';
import { ApiOperation } from '@nestjs/swagger';
import { MatchingService } from './matching.service';
import { successhandler, successMessage } from '../global/successhandler';

@Controller('api/order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly orderBookService: OrderBookService,
    private readonly machineService: MatchingService
  ) {}

  @Post('buy/limit')
  @ApiOperation({ summary: '구매 주문 생성' })
  async createBuyOrder(@Body() limitOrderDto: LimitOrderDto) {
    const orderDto = DtoTransformer.toOrderDto(limitOrderDto);
    await this.orderService.saveOrder(orderDto);
    await this.machineService.matchOrders(limitOrderDto.cropId);
    return successhandler(successMessage.CREATE_ORDER_SUCCESS);
  }

  @Post('sell/limit')
  @ApiOperation({ summary: '판매 주문 생성' })
  async createSellOrder(@Body() limitOrderDto: LimitOrderDto) {
    const orderDto = DtoTransformer.toOrderDto(limitOrderDto);
    await this.orderService.saveOrder(orderDto);
    await this.machineService.matchOrders(limitOrderDto.cropId);
    return successhandler(successMessage.CREATE_ORDER_SUCCESS);
  }

  @Get('')
  @ApiOperation({ summary: '각 회원 체결 내역 조회' })
  async getTransactionsByMemberId(@Query('memberId') memberId: number) {
    const transactions = await this.orderBookService.getTransactionsByMemberId(memberId);
    return successhandler(successMessage.GET_TRANSACTION_SUCCESS, transactions);
  }

  @Post('cancel')
  @ApiOperation({ summary: '주문 취소' })
  async cancelOrder(
    @Body()
    { cropId, orderId, orderType }: { cropId: number; orderId: number; orderType: 'buy' | 'sell' }
  ) {
    await this.orderBookService.removeOrder(cropId, orderId, orderType);
    return successhandler(successMessage.DELETE_ORDER_SUCCESS);
  }
}
