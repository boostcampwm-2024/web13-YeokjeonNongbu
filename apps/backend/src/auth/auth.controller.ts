import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUp.dto';
import { successhandler, successMessage } from 'src/global/successhandler';
import { ApiOperation } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { signUpResponseDecorator } from './decorator/signup.decorator';
import { loginResponseDecorator } from './decorator/login.decorator';
import { AuthGuard } from '@nestjs/passport';
import { GoogleLoginDto } from './dto/googleLogin.dto';
import { KakaoLoginDto } from './dto/kakaoLogin.dto';
import { oauthResponseDecorator } from './decorator/oauth.decorator';
import { JwtAuthGuard } from 'src/global/utils/jwtAuthGuard';
import { Request } from 'express';
import { logoutResponseDecorator } from './decorator/logout.decorator';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: '회원가입 API' })
  @signUpResponseDecorator()
  async signUp(@Body() signUpDto: SignUpDto) {
    await this.authService.signUp(signUpDto);
    return successhandler(successMessage.SIGNUP_SUCCESS);
  }

  @Post('login')
  @ApiOperation({ summary: '로그인 API' })
  @loginResponseDecorator()
  async login(@Body() loginDto: LoginDto) {
    const tokens = await this.authService.login(loginDto);
    return successhandler(successMessage.LOGIN_SUCCESS, tokens);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '로그아웃 API' })
  @logoutResponseDecorator()
  async logout(@Req() req: Request) {
    const token = req.headers.authorization?.split(' ')[1];
    await this.authService.logout(token);
    return successhandler(successMessage.LOGOUT_SUCCESS);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: '구글 로그인 API' })
  async googleLogin() {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: '구글 로그인 리다이렉션 API' })
  @oauthResponseDecorator()
  async googleRedirect(@Req() googleLoginDto: GoogleLoginDto) {
    const tokens = await this.authService.googleLogin(googleLoginDto);
    return successhandler(successMessage.LOGIN_SUCCESS, tokens);
  }

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  @ApiOperation({ summary: '카카오 로그인 API' })
  async kakaoLogin() {}

  @Get('kakao/redirect')
  @UseGuards(AuthGuard('kakao'))
  @ApiOperation({ summary: '카카오 로그인 리다이렉션 API' })
  @oauthResponseDecorator()
  async kakaoRedirect(@Req() kakaoLoginDto: KakaoLoginDto) {
    const tokens = await this.authService.kakaoLogin(kakaoLoginDto);
    return successhandler(successMessage.LOGIN_SUCCESS, tokens);
  }
}
