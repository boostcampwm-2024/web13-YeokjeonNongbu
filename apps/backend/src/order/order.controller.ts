import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderBookService } from './orderBook.service';
import DtoTransformer from './utils/dtoTransformer';
import { LimitOrderDto } from './dto/limitOrder.dto';
import { ApiOperation } from '@nestjs/swagger';
import { MatchingService } from './matching.service';
import { successhandler, successMessage } from '../global/successhandler';
import { cancelOrderResponseDecorator, orderResponseDecorator } from './decorator/order.decorator';
import { transactionResponseDecorator } from './decorator/getTransactions.decorator';
import { HasSufficientCashGuard } from '../account/guards/hasSufficientCashGuard';
import { AccountService } from '../account/account.service';
import { HasSufficientCropGuard } from '../account/guards/hasSufficientCropGuard';
import { MarketOrderDto } from './dto/marketOrder.dto';
import { User } from '../global/utils/memberData';
import { CancelOrderDto } from './dto/cancelOrder.dto';
import { pendingOrdersDecorator } from './decorator/getPendingOrders.decorator';

@Controller('api/order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly orderBookService: OrderBookService,
    private readonly matchingService: MatchingService,
    private readonly accountService: AccountService
  ) {}

  @Post('buy/limit')
  @UseGuards(HasSufficientCashGuard)
  @ApiOperation({ summary: '구매 주문 생성' })
  @orderResponseDecorator()
  async createLimitBuyOrder(
    @User() user: { memberId: number },
    @Body() limitOrderDto: LimitOrderDto
  ) {
    const { memberId } = user;
    const orderDto = DtoTransformer.mapToOrderDto(limitOrderDto, memberId);
    await this.orderService.saveOrder(orderDto);
    await this.accountService.updateCashByPlacingOrder(
      orderDto.memberId,
      orderDto.quantity! * orderDto.price!,
      orderDto.orderType
    );

    await this.matchingService.matchOrders(limitOrderDto.cropId);
    return successhandler(successMessage.CREATE_ORDER_SUCCESS);
  }

  @Post('sell/limit')
  @UseGuards(HasSufficientCropGuard)
  @ApiOperation({ summary: '판매 주문 생성' })
  @orderResponseDecorator()
  async createLimitSellOrder(
    @User() user: { memberId: number },
    @Body() limitOrderDto: LimitOrderDto
  ) {
    const { memberId } = user;
    const orderDto = DtoTransformer.mapToOrderDto(limitOrderDto, memberId);
    await this.orderService.saveOrder(orderDto);
    await this.accountService.updateCropByPlacingSellOrder(
      orderDto.memberId,
      orderDto.cropId,
      orderDto.quantity!
    );

    await this.matchingService.matchOrders(limitOrderDto.cropId);
    return successhandler(successMessage.CREATE_ORDER_SUCCESS);
  }

  @Post('buy/market')
  @UseGuards(HasSufficientCashGuard)
  @ApiOperation({ summary: '시장가 구매 주문 생성' })
  @orderResponseDecorator()
  async createMarketBuyOrder(
    @User() user: { memberId: number },
    @Body() marketOrderDto: MarketOrderDto
  ) {
    const { memberId } = user;
    const orderDto = DtoTransformer.mapToOrderDto(marketOrderDto, memberId);
    await this.orderService.saveOrder(orderDto);
    await this.accountService.updateCashByPlacingOrder(
      orderDto.memberId,
      orderDto.totalAmount!,
      orderDto.orderType
    );

    await this.matchingService.matchOrders(marketOrderDto.cropId);
    return successhandler(successMessage.CREATE_ORDER_SUCCESS);
  }

  @Post('sell/market')
  @UseGuards(HasSufficientCropGuard)
  @ApiOperation({ summary: '시장가 판매 주문 생성' })
  @orderResponseDecorator()
  async createMarketSellOrder(
    @User() user: { memberId: number },
    @Body() marketOrderDto: MarketOrderDto
  ) {
    const { memberId } = user;
    const orderDto = DtoTransformer.mapToOrderDto(marketOrderDto, memberId);
    await this.orderService.saveOrder(orderDto);
    await this.accountService.updateCropByPlacingSellOrder(
      orderDto.memberId,
      orderDto.cropId,
      orderDto.quantity!
    );

    await this.matchingService.matchOrders(marketOrderDto.cropId);
    return successhandler(successMessage.CREATE_ORDER_SUCCESS);
  }

  @Get('')
  @ApiOperation({ summary: '각 회원 체결 내역 조회' })
  @transactionResponseDecorator()
  async getTransactionsByMemberId(@User() user: { memberId: number }) {
    const { memberId } = user;
    const transactions = await this.orderService.getTransactionsByMemberId(memberId);
    return successhandler(successMessage.GET_TRANSACTION_SUCCESS, transactions);
  }

  @Get('pending')
  @ApiOperation({ summary: '각 회원 진행 주문 내역 조회' })
  @pendingOrdersDecorator()
  async getPendingOrdersByMemberId(@User() user: { memberId: number }) {
    const { memberId } = user;
    const pendingOrders = await this.orderService.getPendingOrdersByMemberId(memberId);
    return successhandler(successMessage.GET_PENDING_ORDER_SUCCESS, pendingOrders);
  }

  @Post('cancel')
  @ApiOperation({ summary: '주문 취소' })
  @cancelOrderResponseDecorator()
  async cancelOrder(@User() user: { memberId: number }, @Body() cancelOrderDto: CancelOrderDto) {
    const { memberId } = user;
    const { cropId, orderId, orderType, tradingType } = cancelOrderDto;

    await this.orderBookService.removeOrder(memberId, cropId, orderId, orderType, tradingType);
    await this.orderService.cancelOrder(memberId, orderId, cropId, orderType);
    return successhandler(successMessage.DELETE_ORDER_SUCCESS);
  }
}
