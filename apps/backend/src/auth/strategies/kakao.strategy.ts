import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('KAKAO_REST_API_KEY'),
      callbackURL: configService.get<string>('KAKAO_CALLBACK_URL')
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async validate(...profile: any[]) {
    const { username, id } = profile[2];
    const user = { email: id, nickname: username };
    return user;
  }
}
