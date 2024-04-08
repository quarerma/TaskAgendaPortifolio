/*
  Warnings:

  - Added the required column `completedAt` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "completedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL;
