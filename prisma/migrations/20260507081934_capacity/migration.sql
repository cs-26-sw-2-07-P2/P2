/*
  Warnings:

  - Added the required column `amount` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `capacity` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "capacity" INTEGER NOT NULL;
