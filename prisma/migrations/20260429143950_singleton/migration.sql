/*
  Warnings:

  - You are about to drop the column `questionId` on the `Response` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `Response` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[employeeId]` on the table `Response` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_questionId_fkey";

-- DropIndex
DROP INDEX "Response_employeeId_questionId_key";

-- AlterTable
ALTER TABLE "Questionnaire" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Questionnaire_id_seq";

-- AlterTable
ALTER TABLE "Response" DROP COLUMN "questionId",
DROP COLUMN "value";

-- CreateTable
CREATE TABLE "Answer" (
    "id" SERIAL NOT NULL,
    "value" INTEGER NOT NULL,
    "responseId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Answer_responseId_questionId_key" ON "Answer"("responseId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "Response_employeeId_key" ON "Response"("employeeId");

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "Response"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
