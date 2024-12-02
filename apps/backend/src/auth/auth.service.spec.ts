import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';
import { RedisClientType } from 'redis';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { authQueries } from './auth.queries';
import { SignUpDto } from './dto/signUp.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let mockRedisClient: RedisClientType;
  let mockDatabaseService: DatabaseService;
  let mockJwtService: JwtService;

  beforeEach(async () => {
    mockRedisClient = createClient({ url: 'redis://localhost:6379' });
    mockDatabaseService = { query: jest.fn() } as unknown as DatabaseService;
    mockJwtService = { sign: jest.fn() } as unknown as JwtService;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: DatabaseService, useValue: mockDatabaseService },
        { provide: 'REDIS_CLIENT', useValue: mockRedisClient },
        ConfigService
      ]
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('회원가입', () => {
    it('유효하지 않은 이메일일 경우 에러를 발생시킨다.', async () => {
      const signUpDto: SignUpDto = {
        email: 'invalid-email',
        password: 'password123',
        nickname: 'testuser'
      };

      await expect(authService.signUp(signUpDto)).rejects.toThrowError(
        new HttpException('유효한 이메일 주소를 입력해주세요.', HttpStatus.BAD_REQUEST)
      );
    });

    it('이미 존재하는 이메일일 경우 에러르 발생시킨다.', async () => {
      const signUpDto: SignUpDto = {
        email: 'test@example.com',
        password: 'password123',
        nickname: 'testuser'
      };

      mockDatabaseService.query = jest.fn().mockResolvedValueOnce({
        rows: [{ email: 'test@example.com' }]
      });

      await expect(authService.signUp(signUpDto)).rejects.toThrow(
        new HttpException('중복된 이메일입니다.', HttpStatus.BAD_REQUEST)
      );
    });

    it('정상적인 데이터의 경우 회원 가입에 성공한다.', async () => {
      const signUpDto: SignUpDto = {
        email: 'test@example.com',
        password: 'password123',
        nickname: 'testuser'
      };
      const mockQueryResponse = {
        rows: [{ member_id: 1 }]
      };

      mockDatabaseService.query = jest
        .fn()
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce(mockQueryResponse);

      await authService.signUp(signUpDto);

      expect(mockDatabaseService.query).toHaveBeenCalledWith(authQueries.findByEmailQuery, [
        signUpDto.email
      ]);
      expect(mockDatabaseService.query).toHaveBeenCalledWith(authQueries.signUpQuery, [
        signUpDto.email,
        expect.any(String),
        signUpDto.nickname
      ]);
    });
  });

  describe('로그인', () => {
    it('유효하지 않은 이메일 입력시 에러를 발생시킨다.', async () => {
      const loginDto: LoginDto = {
        email: 'invalid-email',
        password: 'password123'
      };

      await expect(authService.login(loginDto)).rejects.toThrow(
        new HttpException('유효한 이메일 주소를 입력해주세요.', HttpStatus.BAD_REQUEST)
      );
    });

    it('이메일과 비밀번호의 정보가 일치하지 않을 경우 에러를 발생시킨다.', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123'
      };
      const mockQueryResponse = {
        rows: [{ password: 'hashedPassword123' }]
      };
      mockDatabaseService.query = jest.fn().mockResolvedValueOnce(mockQueryResponse);

      await expect(authService.login(loginDto)).rejects.toThrow(
        new HttpException('이메일 또는 비밀번호가 올바르지 않습니다.', HttpStatus.UNAUTHORIZED)
      );
    });

    it('로그인에 성공하면 토큰을 반환한다.', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123'
      };

      mockDatabaseService.query = jest.fn().mockResolvedValueOnce({
        rows: [
          { member_id: 1, nickname: 'testuser', password: await bcrypt.hash('password123', 10) }
        ]
      });
      mockJwtService.sign = jest.fn().mockReturnValue('mockToken');

      const result = await authService.login(loginDto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  });

  describe('로그아웃', () => {
    it('토큰을 갖고 있지 않을 경우 에러를 발생시킨다.', async () => {
      await expect(authService.logout(undefined)).rejects.toThrow(
        new HttpException('토큰이 필요합니다.', HttpStatus.BAD_REQUEST)
      );
    });

    it('로그아웃에 성공하면 토큰을 블랙리스트에 넣는다.', async () => {
      const token = 'mockToken';
      const decodedToken = { exp: Math.floor(Date.now() / 1000) + 60 };

      mockJwtService.decode = jest.fn().mockReturnValue(decodedToken);
      mockRedisClient.set = jest.fn();

      await authService.logout(token);

      expect(mockRedisClient.set).toHaveBeenCalledWith(
        `blacklist:${token}`,
        'true',
        expect.objectContaining({ PX: expect.any(Number) })
      );
    });
  });

  describe('소개 수정', () => {
    it('소개 업데이트가 정상적으로 이루어진다', async () => {
      const memberId = 1;
      const introduce = '소개글 입니다';

      mockDatabaseService.query = jest.fn().mockResolvedValueOnce({});

      await authService.updateIntroduce(memberId, introduce);

      expect(mockDatabaseService.query).toHaveBeenCalledWith(authQueries.updateInroduceQuery, [
        introduce,
        memberId
      ]);
    });
  });

  describe('닉네임 수정', () => {
    it('닉네임 변경이 정상적으로 이루어진다.', async () => {
      const memberId = 1;
      const nickname = 'newNickn';
      mockDatabaseService.query = jest.fn().mockResolvedValueOnce({});

      await authService.updateNickname(memberId, nickname);

      expect(mockDatabaseService.query).toHaveBeenCalledWith(authQueries.updateNicknameQuery, [
        nickname,
        memberId
      ]);
    });

    it('닉네임이 범위 밖일 경우 에러가 발생한다.', async () => {
      const memberId = 1;
      const nickname = 'N';

      await expect(authService.updateNickname(memberId, nickname)).rejects.toThrow(
        new HttpException('닉네임은 2자에서 10자 사이로 입력해주세요.', HttpStatus.BAD_REQUEST)
      );
    });
  });
});
