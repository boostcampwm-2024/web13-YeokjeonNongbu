export interface Transaction {
  orderId: number;
  cropId: number;
  orderType: string;
  price: number;
  totalPrice: number;
  createdAt: string;
  amount: number;
}
