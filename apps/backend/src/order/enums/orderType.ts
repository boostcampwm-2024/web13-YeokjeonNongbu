export enum OrderType {
  BUY = 'buy',
  SELL = 'sell'
}

export enum TradingType {
  LIMIT = 'limit',
  MARKET = 'market'
}

export enum OrderStatus {
  PENDING = 'pending',
  PARTIALLY_FILLED = 'partially_filled',
  COMPLETED = 'completed',
  CANCELED = 'canceled'
}

export function toOrderType(orderType: string): OrderType {
  if (orderType === 'buy') return OrderType.BUY;
  if (orderType === 'sell') return OrderType.SELL;

  throw new Error(`잘못된 오더 타입입니다. ${orderType}`);
}

export function toTradingType(tradingType: string): TradingType {
  if (tradingType === 'limit') return TradingType.LIMIT;
  if (tradingType === 'market') return TradingType.MARKET;

  throw new Error(`잘못된 트레이딩 타입입니다. ${tradingType}`);
}
