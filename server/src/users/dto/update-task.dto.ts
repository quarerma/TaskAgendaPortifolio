import { Priority, TaskType } from '@prisma/client';

export class UpdateTaskDto {
  id: string;
  title: string;
  description: string;
  endAt: Date;
  taskType: TaskType;
  priority: Priority;
}
