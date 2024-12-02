import { handleError } from './HandleError';
import { api } from './Api';
import { CropData } from '@/types/Crop';

interface CropsResponse {
  success: boolean;
  message: string;
  crops?: CropData[];
}

interface CropPriceData {
  cropId: number;
  price: number;
}

interface CropPricesResponse {
  success: boolean;
  message: string;
  prices?: CropPriceData[];
}

export const getCrops = async (): Promise<CropsResponse> => {
  try {
    const response = await api.get('market/crops');

    if (response.data.code === 200) {
      const crops: CropData[] = response.data.data.sort((a: CropData, b: CropData) => {
        return a.cropId - b.cropId;
      });

      return {
        success: true,
        message: response.data.message,
        crops
      };
    }

    return { success: false, message: '알 수 없는 오류가 발생했습니다.' };
  } catch (error) {
    return handleError(error, '데이터 로딩 중 오류가 발생했습니다.');
  }
};

export const getCropPrices = async (): Promise<CropPricesResponse> => {
  try {
    const response = await api.get('market/crop/prices');

    if (response.data.code === 200) {
      const prices: CropPriceData[] = response.data.data;

      return {
        success: true,
        message: response.data.message,
        prices
      };
    }

    return { success: false, message: '알 수 없는 오류가 발생했습니다.' };
  } catch (error) {
    return handleError(error, '데이터 로딩 중 오류가 발생했습니다.');
  }
};

export const getCropPrice = async (cropId: number): Promise<CropPricesResponse> => {
  try {
    const response = await api.get(`market/crop/price/${cropId}`);

    if (response.data.code === 200) {
      const prices: CropPriceData[] = response.data.data;

      return {
        success: true,
        message: response.data.message,
        prices
      };
    }

    return { success: false, message: '알 수 없는 오류가 발생했습니다.' };
  } catch (error) {
    return handleError(error, '데이터 로딩 중 오류가 발생했습니다.');
  }
};
