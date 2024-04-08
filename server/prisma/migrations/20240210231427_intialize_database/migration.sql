-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('NONE', 'MEDIUM', 'URGENCY');

-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('REUNION', 'VISIT', 'PROJECT');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "postedBy" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endAt" TIMESTAMP(3) NOT NULL,
    "taskType" "TaskType" NOT NULL,
    "priority" "Priority" NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);
