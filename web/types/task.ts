export type Task = {
  id: number;
  title: string;
  description: string;
  postedBy: string;
  completed: boolean;
  createdAt: Date;
  endAt: Date;
  completedAt?: Date;
  taskType: TaskType;
  priority: Priority;
};

export type TaskType = "REUNION" | "VISIT" | "PROJECT";

export type Priority = "NONE" | "MEDIUM" | "URGENCY";

export type CreateTaskDto = {
  title: string;
  description: string;
  postedBy: string;
  endAt: string;
  taskType: TaskType;
  priority: Priority;
};

export type UpdateTaskDto = {
  id: string;
  title: string;
  description: string;
  endAt: string;
  taskType: TaskType;
  priority: Priority;
};
