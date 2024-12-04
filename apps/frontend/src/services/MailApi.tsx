import { handleError } from './HandleError';
import { api } from './Api';

export const getAlarm = async () => {
  try {
    const response = await api.get('mail');

    if (response.data.code === 200) {
      const alarm = response.data.data;

      return {
        success: true,
        message: response.data.message,
        alarm: alarm
      };
    } else if (response.data.code === 400) {
      return { success: false, message: response.data.message };
    }

    return { success: false, message: '알 수 없는 오류가 발생했습니다.' };
  } catch (error) {
    return handleError(error, '데이터 로딩 중 오류가 발생했습니다.');
  }
};

export const clearAlarm = async () => {
  try {
    const response = await api.delete('mail');

    if (response.data.code === 200) {
      return { success: true, message: response.data.message };
    } else if (response.data.code === 400) {
      return { success: false, message: response.data.message };
    }

    return { success: false, message: '알 수 없는 오류가 발생했습니다.' };
  } catch (error) {
    return handleError(error, '데이터 로딩 중 오류가 발생했습니다.');
  }
};
