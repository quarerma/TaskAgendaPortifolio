import { Priority, TaskType } from '@prisma/client';

export class CreateTaskDto {
  title: string;
  description: string;
  postedBy: string;
  endAt: Date;
  taskType: TaskType;
  priority: Priority;
}
