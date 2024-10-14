/*
  Warnings:

  - You are about to drop the column `StopId` on the `StopEntrance` table. All the data in the column will be lost.
  - Added the required column `gtfsStopId` to the `StopEntrance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "StopEntrance" DROP CONSTRAINT "StopEntrance_StopId_fkey";

-- AlterTable
ALTER TABLE "StopEntrance" DROP COLUMN "StopId",
ADD COLUMN     "gtfsStopId" TEXT NOT NULL,
ADD COLUMN     "stopId" INTEGER;

-- AddForeignKey
ALTER TABLE "StopEntrance" ADD CONSTRAINT "StopEntrance_stopId_fkey" FOREIGN KEY ("stopId") REFERENCES "Stop"("id") ON DELETE SET NULL ON UPDATE CASCADE;
