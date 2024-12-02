export interface CropListData {
  cropId: number;
  quantity: number;
  cropName: string;
}

export interface OwnCropData {
  cropId: number;
  availableQuantity: number;
  pendingQuantity: number;
  totalQuantity: number;
}

export interface CropData {
  cropId: number;
  cropName: string;
}

export interface NowPriceData {
  cropId: number;
  price: number;
}
