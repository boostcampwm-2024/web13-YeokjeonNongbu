import { Inject, Injectable, HttpException, HttpStatus, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { RedisClientType } from 'redis';

@Injectable()
export class JwtAuthGuard {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType
  ) {}

  async canActivate(context: any) {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) throw new HttpException('허가되지 않은 사용자입니다.', HttpStatus.UNAUTHORIZED);

    const isBlacklist = await this.redisClient.exists(`blacklist:${token}`);
    if (isBlacklist) throw new HttpException('유효하지 않은 토큰입니다.', HttpStatus.UNAUTHORIZED);
    try {
      const decoded = await this.jwtService.verifyAsync(token);

      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTime) {
        throw new HttpException('만료된 토큰입니다.', HttpStatus.UNAUTHORIZED);
      }

      const { memberId, nickname } = decoded;
      request.user = { memberId, nickname };
      return true;
    } catch {
      throw new HttpException('잘못된 토큰입니다.', HttpStatus.UNAUTHORIZED);
    }
  }
}

export const Public = () => SetMetadata('isPublic', true);
