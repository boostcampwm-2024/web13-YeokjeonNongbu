import axios from 'axios';

type ErrorResponse = { success: false; message: string };

export const handleError = (error: unknown, defaultMessage: string): ErrorResponse => {
  if (axios.isAxiosError(error)) {
    if (error.response?.data) {
      const { code, message } = error.response.data;

      if (code) {
        return { success: false, message: message || '잘못된 요청입니다.' };
      }
    }
  }

  return { success: false, message: defaultMessage };
};
