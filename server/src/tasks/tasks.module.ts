import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { PrismaService } from 'src/database/prisma.service';
import { JwtStrategy } from 'src/auth/strat/jwt.strategy';

@Module({
  controllers: [TasksController],
  providers: [TasksService, PrismaService, JwtStrategy],
})
export class TasksModule {}
