/*
  Warnings:

  - You are about to drop the column `acessToken` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "acessToken",
ADD COLUMN     "accessToken" TEXT;
