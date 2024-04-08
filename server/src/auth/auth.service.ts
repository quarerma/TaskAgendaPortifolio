import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthModelUser } from './entity/userlogin.entity';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validadeLogin({
    login,
    password,
  }: AuthModelUser): Promise<string | null> {
    const user: User = await this.prismaService.user.findUnique({
      where: { login },
    });
    console.log(user);

    if (!user) return null;
    if (await bcrypt.compare(password, user.password)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...login } = user;
      return this.jwtService.sign(login);
    }

    return null;
  }
}
