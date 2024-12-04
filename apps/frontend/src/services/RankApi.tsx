import { handleError } from './HandleError';
import { api } from './Api';

export const getTop5 = async () => {
  try {
    const response = await api.get('rank/top5');

    if (response.data.code === 200) {
      const top5 = response.data.data;

      return {
        success: true,
        message: response.data.message,
        top5: top5
      };
    } else if (response.data.code === 401) {
      return { success: false, message: response.data.message };
    }

    return { success: false, message: '알 수 없는 오류가 발생했습니다.' };
  } catch (error) {
    return handleError(error, '데이터 로딩 중 오류가 발생했습니다.');
  }
};

export const getMyRank = async () => {
  try {
    const response = await api.get('rank/now');

    if (response.data.code === 200) {
      const { rank, percentage } = response.data.data;

      return {
        success: true,
        message: response.data.message,
        rank: rank,
        percentage: percentage
      };
    } else if (response.data.code === 401) {
      return { success: false, message: response.data.message };
    }

    return { success: false, message: '알 수 없는 오류가 발생했습니다.' };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: '데이터 로딩 중 오류가 발생했습니다.' };
    }
    return { success: false, message: '데이터 로딩 중 오류가 발생했습니다.' };
  }
};
