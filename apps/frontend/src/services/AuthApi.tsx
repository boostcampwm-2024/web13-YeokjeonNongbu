import { Login, SignUp, Introduce, Nickname } from '@/types/Index';
import { api } from './Api';
import { handleError } from './HandleError';

export const login = async (data: Login) => {
  try {
    const response = await api.post('auth/login', data);

    if (response.data.code === 200) {
      const { accessToken, refreshToken, nickname } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      return {
        success: true,
        message: response.data.message,
        nickname: nickname
      };
    }

    return { success: false, message: '알 수 없는 오류가 발생했습니다.' };
  } catch (error) {
    return handleError(error, '로그인 중 오류가 발생했습니다.');
  }
};

export const signUp = async (data: SignUp) => {
  try {
    const response = await api.post('auth/signup', data);

    if (response.data.code === 201) {
      return { success: true, message: response.data.message };
    }

    return { success: false, message: response.data.message };
  } catch (error) {
    return handleError(error, '회원가입 중 오류가 발생했습니다.');
  }
};

export const logout = async () => {
  try {
    const response = await api.post('auth/logout');

    if (response.data.code === 200) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('nickname');

      return { success: true, message: response.data.message };
    }

    return { success: false, message: '알 수 없는 오류가 발생했습니다.' };
  } catch (error) {
    return handleError(error, '로그아웃 중 오류가 발생했습니다.');
  }
};

export const getIntroduce = async () => {
  try {
    const response = await api.get('auth/introduce');

    if (response.data.code === 200) {
      const { introduce } = response.data.data;

      return {
        success: true,
        message: response.data.message,
        introduce
      };
    }

    return { success: false, message: '알 수 없는 오류가 발생했습니다.' };
  } catch (error) {
    return handleError(error, '데이터 로딩 중 오류가 발생했습니다.');
  }
};

export const updateNickname = async (data: Nickname) => {
  try {
    const response = await api.patch('auth/nickname', data);

    if (response.data.code === 200) {
      return { success: true, message: response.data.message };
    }
    return { success: false, message: '알 수 없는 오류가 발생했습니다.' };
  } catch (error) {
    return handleError(error, '닉네임 변경 중 오류가 발생했습니다.');
  }
};

export const updateIntroduce = async (data: Introduce) => {
  try {
    const response = await api.patch('auth/introduce', data);

    if (response.data.code === 200) {
      return { success: true, message: response.data.message };
    }

    return { success: false, message: '알 수 없는 오류가 발생했습니다.' };
  } catch (error) {
    return handleError(error, '소개글 변경 중 오류가 발생했습니다.');
  }
};

export const isLoggedIn = () => {
  return !!localStorage.getItem('accessToken');
};
