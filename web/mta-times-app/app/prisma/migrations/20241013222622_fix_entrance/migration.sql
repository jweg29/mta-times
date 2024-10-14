/*
  Warnings:

  - Added the required column `gtfsStopId` to the `StopEntrance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "StopEntrance" DROP CONSTRAINT "StopEntrance_gtfsStopId_fkey";

-- AlterTable
ALTER TABLE "StopEntrance" DROP COLUMN "gtfsStopId",
ADD COLUMN     "gtfsStopId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "StopEntrance" ADD CONSTRAINT "StopEntrance_gtfsStopId_fkey" FOREIGN KEY ("gtfsStopId") REFERENCES "Stop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
