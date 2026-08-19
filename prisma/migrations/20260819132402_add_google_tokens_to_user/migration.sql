-- AlterTable
ALTER TABLE "User" ADD COLUMN     "acessToken" TEXT,
ADD COLUMN     "refreshToken" TEXT,
ADD COLUMN     "tokenExpiry" TIMESTAMP(3);
