import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtGuard } from './guards/jwt.guard';
import { RefreshDto } from './dto/refresh.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signup')
  public async signup(@Body() body: SignupDto) {
    return await this.authService.signUp(body);
  }

  @Post('login')
  @HttpCode(HttpStatus.ACCEPTED)
  public async login(@Body() body: LoginDto) {
    return await this.authService.login(body);
  }

  @Post('refresh')
  public async refreshTokens(@Body() body: RefreshDto) {
    return await this.authService.refresh(body.refreshToken);
  }

  @Get('profile')
  @UseGuards(JwtGuard)
  public async getProfile(@Request() req) {
    return req.user;
  }
}
