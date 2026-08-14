-- CreateEnum
CREATE TYPE "TaskColor" AS ENUM ('RED', 'ORANGE', 'YELLOW', 'GREEN', 'BLUE', 'PURPLE');

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "color" "TaskColor";
