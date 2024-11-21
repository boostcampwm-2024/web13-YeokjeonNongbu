interface SuccessMessage {
  code: number;
  message: string;
}

export const successMessage = {
  SIGNUP_SUCCESS: { code: 201, message: '회원 가입되었습니다.' },
  LOGIN_SUCCESS: { code: 200, message: '로그인 되었습니다.' },
  LOGOUT_SUCCESS: { code: 200, message: '로그아웃 되었습니다.' },
  GET_MEMBER_SUCCESS: { code: 201, message: '회원 가입되었습니다.' },
  INTRODUCE_UPDATE_SUCCESS: { code: 200, message: '소개글이 변경되었습니다.' },
  NICKNAME_UPDATE_SUCCESS: { code: 200, message: '닉네임이 변경되었습니다.' },
  GET_MAIL_SUCCESS: { code: 200, message: '메일 조회를 완료했습니다.' },
  DELETE_MAIL_SUCCESS: { code: 200, message: '메일 삭제를 완료했습니다.' },
  GET_MAIL_ALARM_SUCCESS: { code: 200, message: 'Catch alarm!.' },
  BUY_LOTTO_SUCCESS: { code: 200, message: '로또 구매를 완료했습니다.' }
};

export function successhandler<T>(success: SuccessMessage, data: T | null = null) {
  return {
    code: success.code,
    message: success.message,
    ...(data && { data })
  };
}
