import { Body, Controller, Get, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { User } from '../global/utils/memberData';
import { successhandler, successMessage } from '../global/successhandler';
import { Public } from '../global/utils/jwtAuthGuard';
import { SignUpDto } from './dto/signUp.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleLoginDto } from './dto/googleLogin.dto';
import { KakaoLoginDto } from './dto/kakaoLogin.dto';
import { UpdateIntroduceDto } from './dto/updateIntroduce.dto';
import { UpdateNicknameDto } from './dto/updateNickname.dto';
import { signUpResponseDecorator } from './decorator/signUp.decorator';
import { loginResponseDecorator } from './decorator/login.decorator';
import { logoutResponseDecorator } from './decorator/logout.decorator';
import { updateIntroduceResponseDecorator } from './decorator/updateIntroduce.decorator';
import { updateNicknameResponseDecorator } from './decorator/updateNickname.decorator';
import { accountIntroduceDecorator } from './decorator/getIntroduce.decorator';
import { EmailCheckDto } from './dto/emailCheck.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @ApiOperation({ summary: '회원가입 API' })
  @signUpResponseDecorator()
  async signUp(@Body() signUpDto: SignUpDto) {
    await this.authService.signUp(signUpDto);
    return successhandler(successMessage.SIGNUP_SUCCESS);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: '로그인 API' })
  @loginResponseDecorator()
  async login(@Body() loginDto: LoginDto) {
    const tokens = await this.authService.login(loginDto);
    return successhandler(successMessage.LOGIN_SUCCESS, tokens);
  }

  @Post('logout')
  @ApiOperation({ summary: '로그아웃 API' })
  @logoutResponseDecorator()
  async logout(@Req() req: Request) {
    const token = req.headers.authorization?.split(' ')[1];
    await this.authService.logout(token);
    return successhandler(successMessage.LOGOUT_SUCCESS);
  }

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {}

  @Public()
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleRedirect(@User() user: GoogleLoginDto, @Res() response: Response) {
    const redirectURL = await this.authService.googleLogin(user);
    return response.redirect(redirectURL);
  }

  @Public()
  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin() {}

  @Public()
  @Get('kakao/redirect')
  @UseGuards(AuthGuard('kakao'))
  async kakaoRedirect(@User() user: KakaoLoginDto, @Res() response: Response) {
    const redirectURL = await this.authService.kakaoLogin(user);
    return response.redirect(redirectURL);
  }

  @Patch('introduce')
  @ApiOperation({ summary: '유저 소개글 변경 API' })
  @updateIntroduceResponseDecorator()
  async updateIntroduce(
    @User() user: { memberId: number },
    @Body() updateIntroduceDto: UpdateIntroduceDto
  ) {
    const { memberId } = user;
    const { introduce } = updateIntroduceDto;
    await this.authService.updateIntroduce(memberId, introduce);
    return successhandler(successMessage.INTRODUCE_UPDATE_SUCCESS);
  }

  @Get('introduce')
  @ApiOperation({ summary: '회원의 소개글 조회' })
  @accountIntroduceDecorator()
  async getIntroduceFromMemberId(@User() user: { memberId: number }) {
    const { memberId } = user;
    const data = await this.authService.getIntroduce(memberId);
    const introduce = { introduce: data };
    return successhandler(successMessage.GET_INTRODUCE_SUCCESS, introduce);
  }

  @Patch('nickname')
  @ApiOperation({ summary: '유저 닉네임 변경 API' })
  @updateNicknameResponseDecorator()
  async updateNickname(
    @User() user: { memberId: number },
    @Body() updateNicknameDto: UpdateNicknameDto
  ) {
    const { memberId } = user;
    const { nickname } = updateNicknameDto;
    await this.authService.updateNickname(memberId, nickname);
    return successhandler(successMessage.NICKNAME_UPDATE_SUCCESS);
  }

  @Public()
  @Post('emailcheck')
  async emailCheck(@Body() emailCheckDto: EmailCheckDto) {
    const { email } = emailCheckDto;
    await this.authService.emailCheck(email);
    return successhandler(successMessage.CHECK_EMAIL_SUCCESS);
  }
}
