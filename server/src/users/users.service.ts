import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    return await this.prismaService.user.findMany();
  }
  async create(body: CreateUserDto) {
    try {
      const { password, ...userData } = body;
      const hashPassword = await this.hashPassword(password);
      await this.prismaService.user.create({
        data: { ...userData, password: hashPassword },
      });
    } catch (error) {
      console.log('"nao foi possivel criar o usuario"');
    }
  }

  async hashPassword(password: string) {
    const saltOrRounds = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, saltOrRounds);

    return hash;
  }

  async deleteById(login: string) {
    return await this.prismaService.user.delete({ where: { login } });
  }

  async findById(login: string) {
    return await this.prismaService.user.findUnique({ where: { login } });
  }
}
