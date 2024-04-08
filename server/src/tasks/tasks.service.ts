import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Priority, Task } from '@prisma/client';
import { UpdateTaskDto } from 'src/users/dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prismaService: PrismaService) {}

  // getTaskById
  async getTaskById(id: string) {
    const idInt = parseInt(id, 10);
    return await this.prismaService.task.findUnique({ where: { id: idInt } });
  }
  //post
  async createTask(data: CreateTaskDto) {
    const existingTask = await this.prismaService.task.findFirst({
      where: {
        endAt: data.endAt,
      },
    });

    if (existingTask) {
      throw new ConflictException(
        'Já existe uma tarefa agendada para este horário.',
      );
    }

    await this.prismaService.task.create({ data });
  }

  //delete
  async deleteTask(id: number) {
    const idInt = parseInt(id.toString(), 10);
    await this.prismaService.task.delete({ where: { id: idInt } });
  }

  //setTaskCompleted
  async setTaskAsCompleted(id: number) {
    const idInt = parseInt(id.toString(), 10);
    const completionDate = new Date();
    await this.prismaService.task.update({
      where: { id: idInt },
      data: { completed: true, completedAt: completionDate },
    });
  }
  async setTaskAsUnompleted(id: number) {
    const idInt = parseInt(id.toString(), 10);

    await this.prismaService.task.update({
      where: { id: idInt },
      data: { completed: false, completedAt: null },
    });
  }

  // patch endPointDate
  async updateFields(updateBody: UpdateTaskDto) {
    console.log(updateBody);

    const idInt = parseInt(updateBody.id, 10);
    const { description, endAt, priority, taskType, title } = updateBody;

    await this.prismaService.task.update({
      where: { id: idInt },
      data: {
        description,
        endAt,
        priority,
        taskType,
        title,
      },
    });
  }

  // tasks postedby
  async findTaskByUser(postedBy: string) {
    const task = await this.prismaService.task.findMany({
      where: { postedBy },
    });

    return this.sortTasksByTime(task);
  }

  // start server
  async startServer() {
    this.deleteTaskCompletedOverThreeDayAgo();
    console.log('Server started');
  }

  // delete tasks completed over one day ago
  async deleteTaskCompletedOverThreeDayAgo() {
    const date = new Date();
    date.setDate(date.getDate() - 3);
    await this.prismaService.task.deleteMany({
      where: {
        completed: true,
        completedAt: {
          lt: date,
        },
      },
    });
  }

  // all tasks
  async findAll(): Promise<Task[]> {
    const tasks: Task[] = await this.prismaService.task.findMany();

    return await this.sortTasksByTime(tasks);
  }

  // filtered tasks
  async filterByPriority(priority: Priority): Promise<Task[]> {
    if (priority === Priority.NONE) {
      const tasks: Task[] = await this.prismaService.task.findMany({
        where: { priority: Priority.NONE },
      });

      return this.sortTasksByTime(tasks);
    }
    if (priority === Priority.MEDIUM) {
      const tasks: Task[] = await this.prismaService.task.findMany({
        where: { priority: Priority.MEDIUM },
      });

      return this.sortTasksByTime(tasks);
    }
    if (priority === Priority.URGENCY) {
      const tasks: Task[] = await this.prismaService.task.findMany({
        where: { priority: Priority.URGENCY },
      });

      return this.sortTasksByTime(tasks);
    }
  }

  // get tasks on time range
  async getTasksOnTimeRange(inputNumberOfDays: string): Promise<Task[]> {
    const numberOfDays = parseInt(inputNumberOfDays, 10);

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + numberOfDays + 1);

    console.log(typeof numberOfDays);
    console.log(startDate.getDate());

    console.log(startDate);
    console.log(endDate.toDateString());
    let tasks: Task[];
    if (numberOfDays > 0) {
      tasks = await this.prismaService.task.findMany({
        where: {
          endAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      });
    } else {
      tasks = await this.prismaService.task.findMany({
        where: {
          endAt: {
            gte: endDate,
            lte: startDate,
          },
        },
      });
    }

    return await this.sortTasksByTime(tasks);
  }

  async sortTasksByTime(tasks: Task[]): Promise<Task[]> {
    tasks.sort(
      (a, b) => new Date(a.endAt).getTime() - new Date(b.endAt).getTime(),
    );
    return tasks;
  }
}
