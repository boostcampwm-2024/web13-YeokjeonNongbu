import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderBookService } from './orderBook.service';
import { OrderBookDto } from './dto/orderBook.dto';
import DtoTransformer from './utils/dtoTransformer';
import { LimitOrderDto } from './dto/limitOrder.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MatchingService } from './matching.service';

@Controller('api/order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly orderBookService: OrderBookService,
    private readonly machineService: MatchingService
  ) {}

  @Post('buy')
  @ApiOperation({ summary: '구매 주문 생성' })
  @ApiResponse({ status: 200, description: '구매 주문이 성공적으로 생성되었습니다.' })
  async createBuyOrder(@Body() limitOrderDto: LimitOrderDto): Promise<string> {
    const orderDto = DtoTransformer.toOrderDto(limitOrderDto);
    await this.orderService.saveOrder(orderDto);
    await this.machineService.matchOrders(limitOrderDto.cropId);
    return '구매 주문이 성공적으로 생성되었습니다.';
  }

  @Post('sell')
  @ApiOperation({ summary: '판매 주문 생성' })
  @ApiResponse({ status: 200, description: '판매 주문이 성공적으로 생성되었습니다.' })
  async createSellOrder(@Body() limitOrderDto: LimitOrderDto): Promise<string> {
    const orderDto = DtoTransformer.toOrderDto(limitOrderDto);
    await this.orderService.saveOrder(orderDto);
    await this.machineService.matchOrders(limitOrderDto.cropId);
    return '판매 주문이 성공적으로 생성되었습니다.';
  }

  @Get('buy/:cropId')
  async getBuyOrders(@Param('cropId') cropId: number): Promise<OrderBookDto[]> {
    return await this.orderBookService.getBuyOrders(cropId);
  }

  @Get('sell/:cropId')
  async getSellOrders(@Param('cropId') cropId: number): Promise<OrderBookDto[]> {
    return await this.orderBookService.getSellOrders(cropId);
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
