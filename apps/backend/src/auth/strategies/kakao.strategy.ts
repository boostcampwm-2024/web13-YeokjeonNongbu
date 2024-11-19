import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('KAKAO_REST_API_KEY'),
      callbackURL: configService.get<string>(
        'KAKAO_CALLBACK_URL',
        'http://localhost:3000/auth/kakao/redirect'
      )
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: { nickname: string; email: string }
  ) {
    const { nickname, email } = profile;

    const member = { email, nickname };
    return member;
  }
}
