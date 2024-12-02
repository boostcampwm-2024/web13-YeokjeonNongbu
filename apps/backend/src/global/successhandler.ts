import { Nullable } from './utils/dataCustomType';

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
  GET_TRANSACTION_SUCCESS: { code: 200, message: '거래 내역 조회를 완료했습니다.' },
  CREATE_ORDER_SUCCESS: { code: 201, message: '주문이 성공적으로 생성되었습니다.' },
  DELETE_ORDER_SUCCESS: { code: 201, message: '주문이 성공적으로 삭제되었습니다.' },
  BUY_LOTTO_SUCCESS: { code: 200, message: '로또 구매를 완료했습니다.' },
  TOP5_RANK_GET_SUCCESS: { code: 200, message: '상위 5명을 조회했습니다.' },
  GET_ACCOUNT_CASH_SUCCESS: { code: 200, message: '회원 잔고 조회 성공' },
  GET_TOP5_RANK_SUCCESS: { code: 200, message: '상위 5명을 조회했습니다.' },
  GET_RANK_SUCCESS: { code: 200, message: '현재 랭킹을 조회했습니다.' },
  GET_CROPS_NAME_INFO_SUCCESS: { code: 200, message: '작물 정보 조회 성공' },
  GET_CROP_PRICE_INFO_SUCCESS: { code: 200, message: '작물 가격 정보 조회 성공' },
  GET_ALL_CROP_PRICE_INFO_SUCCESS: { code: 200, message: '작물 가격 정보 조회 성공' },
  GET_ACCOUNT_CROP_SUCCESS: { code: 200, message: '회원 작물 조회 성공' },
  GET_ACCOUNT_CROP_VALUE_SUCCESS: { code: 200, message: '회원의 총 보유 작물 가치 조회 성공' },
  GET_INTRODUCE_SUCCESS: { code: 200, message: '소개글 조회 성공' },
  GET_CROP_CHART_DATA_SUCCESS: { code: 200, message: '차트 데이터 조회 성공' },
  GET_PENDING_ORDER_SUCCESS: { code: 200, message: '미체결 주문 조회 성공' },
  CANCEL_ORDER_SUCCESS: { code: 200, message: '주문 취소 성공' }
};

export function successhandler<T>(success: SuccessMessage, data: Nullable<T> = null) {
  return {
    code: success.code,
    message: success.message,
    ...(data && { data })
  };
}
