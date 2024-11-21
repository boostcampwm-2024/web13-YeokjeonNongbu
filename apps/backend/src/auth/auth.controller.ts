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
import { oauthResponseDecorator } from './decorator/oauth.decorator';

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

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: '구글 로그인 API' })
  async googleLogin() {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  @oauthResponseDecorator()
  @ApiOperation({ summary: '구글 로그인 후 리다이렉션 API' })
  async googleRedirect(@Req() googleLoginDto: GoogleLoginDto) {
    const tokens = await this.authService.googleLogin(googleLoginDto);
    return successhandler(successMessage.LOGIN_SUCCESS, tokens);
  }
}
