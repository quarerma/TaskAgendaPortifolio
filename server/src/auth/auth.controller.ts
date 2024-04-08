import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthModelUser } from './entity/userlogin.entity';
import { Request } from 'express';
import { JwtAuthGuards } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: AuthModelUser) {
    const payload = await this.authService.validadeLogin(body);
    console.log('payload', payload);
    if (payload === null) {
      return new HttpException(
        'Usuário ou senha inválidos',
        HttpStatus.UNAUTHORIZED,
      );
    }
    console.log('passou');
    return payload;
  }

  @Get('status')
  @UseGuards(JwtAuthGuards)
  async status(@Req() req: Request) {
    console.log('controller');
    console.log(req.user);
  }

  @Get('validateToken')
  @UseGuards(JwtAuthGuards)
  async validateToken() {
    return true;
  }
}
