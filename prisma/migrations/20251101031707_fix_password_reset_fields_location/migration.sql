/*
  Warnings:

  - You are about to drop the column `passwordResetExpires` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `passwordResetToken` on the `Game` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "passwordResetExpires",
DROP COLUMN "passwordResetToken";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passwordResetExpires" TIMESTAMP(3),
ADD COLUMN     "passwordResetToken" TEXT;
