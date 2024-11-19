import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class JwtAuthGuard {
  constructor(
    private jwtService: JwtService,
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType
  ) {}

  async canActivate(context: any) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) throw new HttpException('허가되지 않은 사용자입니다.', HttpStatus.UNAUTHORIZED);

    const isBlacklist = await this.redisClient.exists(`blacklist:${token}`);
    if (isBlacklist) throw new HttpException('유효하지 않은 토큰입니다.', HttpStatus.UNAUTHORIZED);

    try {
      const decoded = await this.jwtService.verifyAsync(token);
      request.user = decoded;
      return true;
    } catch {
      throw new HttpException('유효하지 않은 토큰입니다.', HttpStatus.UNAUTHORIZED);
    }
  }
}
