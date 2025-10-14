/*
  Warnings:

  - The `genre` column on the `Game` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[name]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "RecommendationStatus" AS ENUM ('RECOMMENDED', 'MIXED_FEELINGS', 'NOT_RECOMMENDED');

-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('PLAYING', 'COMPLETED', 'ON_BACKLOG', 'DROPPED');

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "genre",
ADD COLUMN     "genre" TEXT[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarUrl" TEXT;

-- AlterTable
ALTER TABLE "UserGameLog" ADD COLUMN     "comment" VARCHAR(300),
ADD COLUMN     "finishedAt" TIMESTAMP(3),
ADD COLUMN     "recommendation" "RecommendationStatus",
ADD COLUMN     "startedAt" TIMESTAMP(3),
ADD COLUMN     "status" "GameStatus" NOT NULL DEFAULT 'PLAYING';

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");
