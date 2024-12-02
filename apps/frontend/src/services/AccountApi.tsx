import { handleError } from './HandleError';
import { api } from './Api';
import { CropListData } from '@/types/Crop';

interface CashResponse {
  success: boolean;
  message: string;
  availableCash?: number;
  pendingCash?: number;
  totalCash?: number;
}

interface CropsValueResponse {
  success: boolean;
  message: string;
  value?: number;
}

interface CropsResponse {
  success: boolean;
  message: string;
  ownCrops?: CropListData[];
}

export const getCash = async (): Promise<CashResponse> => {
  try {
    const response = await api.get('account/cash');

    if (response.data.code === 200) {
      const { availableCash, pendingCash, totalCash } = response.data.data;

      return {
        success: true,
        message: response.data.message,
        availableCash,
        pendingCash,
        totalCash
      };
    }

    return { success: false, message: '알 수 없는 오류가 발생했습니다.' };
  } catch (error) {
    return handleError(error, '데이터 로딩 중 오류가 발생했습니다.');
  }
};

export const getOwnCropsValue = async (): Promise<CropsValueResponse> => {
  try {
    const response = await api.get('account/crops/value');

    if (response.data.code === 200) {
      const { value } = response.data.data;

      return {
        success: true,
        message: response.data.message,
        value
      };
    }

    return { success: false, message: '알 수 없는 오류가 발생했습니다.' };
  } catch (error) {
    return handleError(error, '데이터 로딩 중 오류가 발생했습니다.');
  }
};

export const getOwnCrops = async (): Promise<CropsResponse> => {
  try {
    const response = await api.get('account/crops');

    if (response.data.code === 200) {
      const ownCrops = response.data.data;

      return {
        success: true,
        message: response.data.message,
        ownCrops
      };
    }

    return { success: false, message: '알 수 없는 오류가 발생했습니다.' };
  } catch (error) {
    return handleError(error, '데이터 로딩 중 오류가 발생했습니다.');
  }
};
