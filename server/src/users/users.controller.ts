import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

import { JwtAuthGuards } from 'src/auth/guards/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('getByLogin/:id')
  async getById(@Param('login') login: string): Promise<User> {
    return await this.usersService.findById(login);
  }

  @Get('getAll')
  @UseGuards(JwtAuthGuards)
  async getAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Post('create')
  async create(@Body() user: User) {
    await this.usersService.create(user);
  }
}
