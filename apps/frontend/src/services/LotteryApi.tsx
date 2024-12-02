import { api } from './Api';
import { handleError } from './HandleError';

export const getLottoResult = async () => {
  try {
    const response = await api.post('/lotto');

    if (response.data.code === 200) {
      const { remainCash, rank } = response.data.data;

      return {
        success: true,
        message: response.data.message,
        remainCash: remainCash,
        rank: rank
      };
    }
    return { success: false, message: '알 수 없는 오류가 발생했습니다.' };
  } catch (error) {
    return handleError(error, '데이터 로딩 중 오류가 발생했습니다.');
  }
};
