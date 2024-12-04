import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { SignUpDto } from './dto/signUp.dto';
import * as bcrypt from 'bcrypt';
import { authQueries } from './auth.queries';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { GoogleLoginDto } from './dto/googleLogin.dto';
import { KakaoLoginDto } from './dto/kakaoLogin.dto';
import { RedisClientType } from 'redis';
import { Nullable, Optional } from '../global/utils/dataCustomType';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
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

    const member = await this.databaseService.query(authQueries.signUpQuery, [
      email,
      hashedPassword,
      nickname
    ]);
    await this.databaseService.query(authQueries.createLottoColumnQuery, [
      member.rows[0].member_id
    ]);
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
    if (member.rows.length === 0)
      throw new HttpException('이메일 또는 비밀번호가 올바르지 않습니다.', HttpStatus.UNAUTHORIZED);

    const isPasswordValid = await bcrypt.compare(password, member.rows[0].password);
    if (!isPasswordValid)
      throw new HttpException('이메일 또는 비밀번호가 올바르지 않습니다.', HttpStatus.UNAUTHORIZED);

    const nickname = member.rows[0].nickname;
    const { accessToken, refreshToken } = await this.generateTokens(
      member.rows[0].member_id,
      member.rows[0].nickname
    );
    return { nickname, accessToken, refreshToken };
  }

  private async verifyUser(email: string, nickname: string) {
    const existingUser = await this.databaseService.query(authQueries.findByEmailQuery, [email]);
    if (existingUser?.rowCount === 1) return existingUser.rows[0];

    const hashedPassword = await bcrypt.hash('default', 10);

    const newMember = await this.databaseService.query(authQueries.signUpQuery, [
      email,
      hashedPassword,
      nickname
    ]);

    return newMember.rows[0];
  }

  async SocialLogin(email: string, nickname: string) {
    const member = await this.verifyUser(email, nickname);
    const { accessToken, refreshToken } = await this.generateTokens(
      member.member_id,
      member.nickname
    );
    const oauthRedirectURL = this.configService.get<string>('OAUTH_CALLBACK_URL');
    const redirectUrl = `${oauthRedirectURL}?accessToken=${accessToken}&refreshToken=${refreshToken}&nickname=${member.nickname}`;
    return redirectUrl;
  }

  private async generateTokens(memberId: number, nickname: string) {
    const payload = { memberId, nickname };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '24h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }

  async googleLogin(googleLoginDto: GoogleLoginDto) {
    const { email, name } = googleLoginDto;
    return this.SocialLogin(email, name);
  }

  async kakaoLogin(kakaoLoginDto: KakaoLoginDto) {
    const { email, nickname } = kakaoLoginDto;
    return this.SocialLogin(email, nickname);
  }

  async logout(token: Optional<string>) {
    if (!token) throw new HttpException('토큰이 필요합니다.', HttpStatus.BAD_REQUEST);

    const decodedToken = this.jwtService.decode(token) as { exp: number };
    if (!decodedToken || !decodedToken.exp)
      throw new HttpException('유효하지 않은 토큰입니다.', HttpStatus.UNAUTHORIZED);

    const remainingTime = decodedToken.exp * 1000 - Date.now();
    if (remainingTime > 0)
      await this.redisClient.set(`blacklist:${token}`, 'true', { PX: remainingTime });
  }

  async updateIntroduce(memberId: number, introduce: Nullable<string>) {
    await this.databaseService.query(authQueries.updateInroduceQuery, [introduce, memberId]);
  }

  async getIntroduce(memberId: number): Promise<string> {
    const data = await this.databaseService.query(authQueries.getIntroduceQuery, [memberId]);
    return data.rows[0].introduce;
  }

  async updateNickname(memberId: number, nickname: Nullable<string>) {
    if (!nickname || nickname.length < 2 || nickname.length > 10)
      throw new HttpException('닉네임은 2자에서 10자 사이로 입력해주세요.', HttpStatus.BAD_REQUEST);
    await this.databaseService.query(authQueries.updateNicknameQuery, [nickname, memberId]);
  }

  async emailCheck(email: string) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email))
      throw new HttpException('유효한 이메일 주소를 입력해주세요.', HttpStatus.BAD_REQUEST);
    const existingUser = await this.databaseService.query(authQueries.findByEmailQuery, [email]);
    if (existingUser.rows.length > 0) {
      throw new HttpException('중복된 이메일입니다.', HttpStatus.BAD_REQUEST);
    }
  }
}
