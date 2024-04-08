import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Priority } from '@prisma/client';
import { JwtAuthGuards } from 'src/auth/guards/jwt.guard';
import { UpdateTaskDto } from 'src/users/dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('startServer')
  @UseGuards(JwtAuthGuards)
  async startServer() {
    console.log('startServer');
    try {
      await this.tasksService.startServer();
    } catch (error) {
      return new HttpException('Falha ao conectar', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('getTaskById/:id')
  @UseGuards(JwtAuthGuards)
  async getTaskById(@Param('id') id: string) {
    return await this.tasksService.getTaskById(id);
  }

  @Get('getTasksOnTimeRange/:numberOfDays')
  @UseGuards(JwtAuthGuards)
  async getTasksOnTimeRange(@Param('numberOfDays') numberOfDays: string) {
    return await this.tasksService.getTasksOnTimeRange(numberOfDays);
  }

  @Post('create')
  @UseGuards(JwtAuthGuards)
  async create(@Body() createTaskDto: CreateTaskDto) {
    try {
      await this.tasksService.createTask(createTaskDto);

      return { message: 'Tarefa criada com sucesso!' };
    } catch (error) {
      throw new HttpException(
        'Erro ao criar tarefa.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: number) {
    return await this.tasksService.deleteTask(id);
  }

  @Put('complete/:id')
  @UseGuards(JwtAuthGuards)
  async setTaskAsCompleted(@Param('id') id: number) {
    await this.tasksService.setTaskAsCompleted(id);
  }

  @Put('uncomplete/:id')
  @UseGuards(JwtAuthGuards)
  async setTaskAsUnompleted(@Param('id') id: number) {
    return await this.tasksService.setTaskAsUnompleted(id);
  }

  @Patch('atualizar')
  @UseGuards(JwtAuthGuards)
  async updateFields(@Body() taskUpdated: UpdateTaskDto) {
    console.log(typeof taskUpdated);
    await this.tasksService.updateFields(taskUpdated);
  }

  @Get('findTaskByUser/:postedBy')
  @UseGuards(JwtAuthGuards)
  async findTaskByUser(@Param('postedBy') postedBy: string) {
    return await this.tasksService.findTaskByUser(postedBy);
  }

  @Get('findAll')
  @UseGuards(JwtAuthGuards)
  async findAll() {
    return await this.tasksService.findAll();
  }

  @Get('filterByPriority/:priority')
  @UseGuards(JwtAuthGuards)
  async filterByPriority(@Param('priority') priority: Priority) {
    return await this.tasksService.filterByPriority(priority);
  }
}
