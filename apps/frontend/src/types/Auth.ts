export interface Login {
  email: string;
  password: string;
}

export interface SignUp {
  email: string;
  password: string;
  nickname: string;
}

export interface Nickname {
  nickname: string;
}

export interface Introduce {
  introduce: string;
}

export type Platform = 'google' | 'kakao';
