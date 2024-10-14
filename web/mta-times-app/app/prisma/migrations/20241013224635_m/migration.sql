-- DropForeignKey
ALTER TABLE "StopEntrance" DROP CONSTRAINT "StopEntrance_StopId_fkey";

-- AlterTable
ALTER TABLE "StopEntrance" ALTER COLUMN "StopId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "StopEntrance" ADD CONSTRAINT "StopEntrance_StopId_fkey" FOREIGN KEY ("StopId") REFERENCES "Stop"("id") ON DELETE SET NULL ON UPDATE CASCADE;
