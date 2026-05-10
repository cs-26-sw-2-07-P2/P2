-- DropForeignKey
ALTER TABLE "JobParameter" DROP CONSTRAINT "JobParameter_jobId_fkey";

-- AddForeignKey
ALTER TABLE "JobParameter" ADD CONSTRAINT "JobParameter_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
