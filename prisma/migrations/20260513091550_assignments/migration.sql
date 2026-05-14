/*
  Warnings:

  - You are about to drop the column `amount` on the `Job` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "amount";

-- CreateTable
CREATE TABLE "Assignment" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "jobId" INTEGER NOT NULL,
    "compatibility" DOUBLE PRECISION NOT NULL,
    "priorityRank" INTEGER NOT NULL,
    "manuallyAdjusted" BOOLEAN NOT NULL DEFAULT false,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Assignment_employeeId_key" ON "Assignment"("employeeId");

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
