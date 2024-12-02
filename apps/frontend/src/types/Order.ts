export interface Order {
  cropId: number;
  orderType: string;
  tradingType: string;
  quantity?: number;
  price?: number;
  totalAmount?: number;
  orderId?: number;
}

export interface HistoryData {
  orderId: number;
  cropId: number;
  orderType: string;
  price: number;
  totalPrice: number;
  createdAt: string;
  amount: number;
}
