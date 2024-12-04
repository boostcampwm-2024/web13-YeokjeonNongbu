import { handleError } from './HandleError';
import { api } from './Api';
import { HistoryData, Order } from '@/types/Index';

export const getOrderHistory = async () => {
  try {
    const response = await api.get('order');

    if (response.data.code === 200) {
      const history: HistoryData[] = response.data.data;

      return {
        success: true,
        message: response.data.message,
        history
      };
    }

    return { success: false, message: '알 수 없는 오류가 발생했습니다.' };
  } catch (error) {
    return handleError(error, '데이터 로딩 중 오류가 발생했습니다.');
  }
};

export const getPendingOrder = async () => {
  try {
    const response = await api.get('order/pending');

    if (response.data.code === 200) {
      const pending = response.data.data;

      return { success: true, message: response.data.message, pending };
    }

    return { success: false, message: '알 수 없는 오류가 발생했습니다.' };
  } catch (error) {
    return handleError(error, '데이터 로딩 중 오류가 발생했습니다.');
  }
};

export const postLimitBuyOrder = async (data: Order) => {
  try {
    const response = await api.post('order/buy/limit', data);

    if (response.data.code === 201) {
      return { success: true, message: response.data.message };
    } else if (response.data.code === 403) {
      return { sucess: false, message: response.data.message };
    }

    return { success: false, message: '알 수 없는 오류가 발생했습니다.' };
  } catch (error) {
    return handleError(error, '데이터 로딩 중 오류가 발생했습니다.');
  }
};

export const postLimitSellOrder = async (data: Order) => {
  try {
    const response = await api.post('order/sell/limit', data);

    if (response.data.code === 201) {
      return { success: true, message: response.data.message };
    } else if (response.data.code === 403) {
      return { sucess: false, message: response.data.message };
    }

    return { success: false, message: '알 수 없는 오류가 발생했습니다.' };
  } catch (error) {
    return handleError(error, '데이터 로딩 중 오류가 발생했습니다.');
  }
};

export const postMarketBuyOrder = async (data: Order) => {
  try {
    const response = await api.post('order/buy/market', data);

    if (response.data.code === 201) {
      return { success: true, message: response.data.message };
    } else if (response.data.code === 400 || response.data.code === 403) {
      return { success: true, message: response.data.message };
    }

    return { success: false, message: '알 수 없는 오류가 발생했습니다.' };
  } catch (error) {
    return handleError(error, '데이터 로딩 중 오류가 발생했습니다.');
  }
};

export const postMarketSellOrder = async (data: Order) => {
  try {
    const response = await api.post('order/sell/market', data);

    if (response.data.code === 201) {
      return { success: true, message: response.data.message };
    } else if (response.data.code === 400 || response.data.code === 403) {
      return { success: true, message: response.data.message };
    }

    return { success: false, message: '알 수 없는 오류가 발생했습니다.' };
  } catch (error) {
    return handleError(error, '데이터 로딩 중 오류가 발생했습니다.');
  }
};

export const postCancelOrder = async (data: Order) => {
  try {
    const response = await api.post('order/cancel', data);

    if (response.data.code === 201) {
      const pending = response.data.data;

      return { success: true, message: response.data.message, pending };
    } else if (response.data.code === 400 || response.data.code === 404) {
      const pending = response.data.data;

      return { success: false, message: response.data.message, pending };
    }

    return { success: false, message: '알 수 없는 오류가 발생했습니다.' };
  } catch (error) {
    return handleError(error, '데이터 로딩 중 오류가 발생했습니다.');
  }
};
