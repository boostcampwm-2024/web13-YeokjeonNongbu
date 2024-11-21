import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderBookService } from './orderBook.service';
import DtoTransformer from './utils/dtoTransformer';
import { LimitOrderDto } from './dto/limitOrder.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MatchingService } from './matching.service';
import { OrderDto } from './dto/order.dto';

@Controller('api/order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly orderBookService: OrderBookService,
    private readonly machineService: MatchingService
  ) {}

  @Post('buy/limit')
  @ApiOperation({ summary: '구매 주문 생성' })
  @ApiResponse({ status: 200, description: '구매 주문이 성공적으로 생성되었습니다.' })
  async createBuyOrder(@Body() limitOrderDto: LimitOrderDto): Promise<string> {
    const orderDto = DtoTransformer.toOrderDto(limitOrderDto);
    await this.orderService.saveOrder(orderDto);
    await this.machineService.matchOrders(limitOrderDto.cropId);
    return '구매 주문이 성공적으로 생성되었습니다.';
  }

  @Post('sell/limit')
  @ApiOperation({ summary: '판매 주문 생성' })
  @ApiResponse({ status: 200, description: '판매 주문이 성공적으로 생성되었습니다.' })
  async createSellOrder(@Body() limitOrderDto: LimitOrderDto): Promise<string> {
    const orderDto = DtoTransformer.toOrderDto(limitOrderDto);
    await this.orderService.saveOrder(orderDto);
    await this.machineService.matchOrders(limitOrderDto.cropId);
    return '판매 주문이 성공적으로 생성되었습니다.';
  }

  @Get('')
  @ApiOperation({ summary: '각 회원 체결 내역 조회' })
  async getTransactionsByMemberId(@Query('memberId') memberId: number): Promise<OrderDto[]> {
    return await this.orderBookService.getTransactionsByMemberId(memberId);
  }

  @Post('cancel')
  async cancelOrder(
    @Body()
    { cropId, orderId, orderType }: { cropId: number; orderId: number; orderType: 'buy' | 'sell' }
  ): Promise<string> {
    await this.orderBookService.removeOrder(cropId, orderId, orderType);
    return '주문이 성공적으로 취소되었습니다.';
  }
}
