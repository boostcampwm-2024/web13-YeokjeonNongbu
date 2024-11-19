import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { SignUpDto } from './dto/signUp.dto';
import * as bcrypt from 'bcrypt';
import { authQueries } from './auth.queries';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { GoogleLoginDto } from './dto/googleLogin.dto';
import { KakaoLoginDto } from './dto/kakaoLogin.dto';
import { RedisClientType } from 'redis';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { email, password, nickname } = signUpDto;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email))
      throw new HttpException('유효한 이메일 주소를 입력해주세요.', HttpStatus.BAD_REQUEST);

    if (!password || password.length < 8 || password.length > 16)
      throw new HttpException(
        '비밀번호는 8자에서 16자 사이로 입력해주세요.',
        HttpStatus.BAD_REQUEST
      );

    const existingUser = await this.databaseService.query(authQueries.findByEmailQuery, [email]);
    if (existingUser && existingUser.rows.length > 0) {
      throw new HttpException('중복된 이메일입니다.', HttpStatus.BAD_REQUEST);
    }

    if (!nickname || nickname.length < 2 || nickname.length > 10)
      throw new HttpException('닉네임은 2자에서 10자 사이로 입력해주세요.', HttpStatus.BAD_REQUEST);
    const hashedPassword = await bcrypt.hash(password, 10);

    await this.databaseService.query(authQueries.signUpQuery, [email, hashedPassword, nickname]);
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email))
      throw new HttpException('유효한 이메일 주소를 입력해주세요.', HttpStatus.BAD_REQUEST);

    if (!password || password.length < 8 || password.length > 16)
      throw new HttpException(
        '비밀번호는 8자에서 16자 사이로 입력해주세요.',
        HttpStatus.BAD_REQUEST
      );

    const member = await this.databaseService.query(authQueries.findByEmailQuery, [email]);
    if (!member)
      throw new HttpException('이메일 또는 비밀번호가 올바르지 않습니다.', HttpStatus.UNAUTHORIZED);

    const isPasswordValid = await bcrypt.compare(password, member.rows[0].password);
    if (!isPasswordValid) {
      throw new HttpException('이메일 또는 비밀번호가 올바르지 않습니다.', HttpStatus.UNAUTHORIZED);
    }

    const payload = {
      memberId: member.rows[0].member_id,
      email,
      nickname: member.rows[0].nickname
    };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }

  async loginWithSocialMedia(email: string, nickname: string) {
    const existingUser = await this.databaseService.query(authQueries.findByEmailQuery, [email]);

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('default', 10);
      await this.databaseService.query(authQueries.signUpQuery, [email, hashedPassword, nickname]);
    }
    const member = await this.databaseService.query(authQueries.findByEmailQuery, [email]);
    const payload = {
      memberId: member.rows[0].member_id,
      email,
      nickname: member.rows[0].nickname
    };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }

  async googleLogin(googleLoginDto: GoogleLoginDto) {
    const { email, name } = googleLoginDto;
    return this.loginWithSocialMedia(email, name);
  }

  async kakaoLogin(kakaoLoginDto: KakaoLoginDto) {
    const { email, nickname } = kakaoLoginDto;
    return this.loginWithSocialMedia(email, nickname);
  }

  async logout(token: string | undefined) {
    if (!token) throw new HttpException('토큰이 필요합니다.', HttpStatus.BAD_REQUEST);

    const decodedToken = this.jwtService.decode(token) as { exp: number };
    if (!decodedToken || !decodedToken.exp) {
      throw new HttpException('유효하지 않은 토큰입니다.', HttpStatus.UNAUTHORIZED);
    }

    const remainingTime = decodedToken.exp * 1000 - Date.now();
    if (remainingTime > 0) {
      await this.redisClient.set(`blacklist:${token}`, 'true', { PX: remainingTime });
    }
  }
}
