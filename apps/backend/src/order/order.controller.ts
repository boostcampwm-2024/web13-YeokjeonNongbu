import { Body, Controller, Get, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common';
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
import { User } from '../global/utils/memberData';
import { CancelOrderDto } from './dto/cancelOrder.dto';
import { pendingOrdersDecorator } from './decorator/getPendingOrders.decorator';
import { OrderStatus } from './enums/orderType';
import { MarketOrderDto } from './dto/marketOrder.dto';

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
    try {
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
    } catch (error) {
      console.error('구매 주문 생성 중 오류:', error);
      throw new HttpException('구매 주문 생성에 실패했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('sell/limit')
  @UseGuards(HasSufficientCropGuard)
  @ApiOperation({ summary: '판매 주문 생성' })
  @orderResponseDecorator()
  async createLimitSellOrder(
    @User() user: { memberId: number },
    @Body() limitOrderDto: LimitOrderDto
  ) {
    try {
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
    } catch (error) {
      console.error('판매 주문 생성 중 오류:', error);
      throw new HttpException('판매 주문 생성에 실패했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('buy/market')
  @UseGuards(HasSufficientCashGuard)
  @ApiOperation({ summary: '시장가 구매 주문 생성' })
  @orderResponseDecorator()
  async createMarketBuyOrder(
    @User() user: { memberId: number },
    @Body() marketOrderDto: MarketOrderDto
  ) {
    if (!(await this.orderBookService.isMarketOrderAvailable(marketOrderDto))) {
      return {
        code: HttpStatus.BAD_REQUEST,
        message: '매도 주문이 없습니다.'
      };
    }

    try {
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
    } catch (error) {
      console.error('시장가 구매 주문 생성 중 오류:', error);
      throw new HttpException(
        '시장가 구매 주문 생성에 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('sell/market')
  @UseGuards(HasSufficientCropGuard)
  @ApiOperation({ summary: '시장가 판매 주문 생성' })
  @orderResponseDecorator()
  async createMarketSellOrder(
    @User() user: { memberId: number },
    @Body() marketOrderDto: MarketOrderDto
  ) {
    if (!(await this.orderBookService.isMarketOrderAvailable(marketOrderDto))) {
      return {
        code: HttpStatus.BAD_REQUEST,
        message: '매수 주문이 없습니다.'
      };
    }

    try {
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
    } catch (error) {
      console.error('시장가 판매 주문 생성 중 오류:', error);
      throw new HttpException(
        '시장가 판매 주문 생성에 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('')
  @ApiOperation({ summary: '각 회원 체결 내역 조회' })
  @transactionResponseDecorator()
  async getTransactionsByMemberId(@User() user: { memberId: number }) {
    try {
      const { memberId } = user;
      const transactions = await this.orderService.getTransactionsByMemberId(memberId);
      return successhandler(successMessage.GET_TRANSACTION_SUCCESS, transactions);
    } catch (error) {
      console.error('체결 내역 조회 중 오류:', error);
      throw new HttpException('체결 내역 조회에 실패했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('pending')
  @ApiOperation({ summary: '각 회원 진행 주문 내역 조회' })
  @pendingOrdersDecorator()
  async getPendingOrdersByMemberId(@User() user: { memberId: number }) {
    try {
      const { memberId } = user;
      const pendingOrders = await this.orderService.getPendingOrdersByMemberId(memberId);
      return successhandler(successMessage.GET_PENDING_ORDER_SUCCESS, pendingOrders);
    } catch (error) {
      console.error('진행 주문 내역 조회 중 오류:', error);
      throw new HttpException(
        '진행 주문 내역 조회에 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('cancel')
  @ApiOperation({ summary: '주문 취소' })
  @pendingOrdersDecorator()
  @cancelOrderResponseDecorator()
  async cancelOrder(@User() user: { memberId: number }, @Body() cancelOrderDto: CancelOrderDto) {
    const { memberId } = user;
    const { cropId, orderId, orderType, tradingType } = cancelOrderDto;

    try {
      const orderStatus = await this.orderService.getOrderStatus(memberId, orderId);
      if (orderStatus === OrderStatus.CANCELED || orderStatus === OrderStatus.COMPLETED) {
        const pendingOrders = await this.orderService.getPendingOrdersByMemberId(memberId);
        return {
          code: HttpStatus.BAD_REQUEST,
          message: '대기중인 주문이 존재하지 않습니다.',
          data: pendingOrders
        };
      }

      await this.orderBookService.removeOrder(memberId, cropId, orderId, orderType, tradingType);
      await this.orderService.cancelOrder(memberId, orderId, cropId, orderType);
      const pendingOrders = await this.orderService.getPendingOrdersByMemberId(memberId);

      return {
        code: 201,
        message: '주문이 성공적으로 삭제되었습니다.',
        data: pendingOrders
      };
    } catch (error) {
      console.error('주문 취소 중 오류:', error);
      if (error instanceof HttpException && error.getStatus() === HttpStatus.NOT_FOUND) {
        const pendingOrders = await this.orderService.getPendingOrdersByMemberId(memberId);
        return {
          code: HttpStatus.NOT_FOUND,
          message: '주문이 존재하지 않습니다.',
          data: pendingOrders
        };
      }
      throw new HttpException('주문 취소에 실패했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
