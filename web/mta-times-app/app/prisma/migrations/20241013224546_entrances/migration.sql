/*
  Warnings:

  - You are about to drop the column `gtfsStopId` on the `StopEntrance` table. All the data in the column will be lost.
  - Added the required column `StopId` to the `StopEntrance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "StopEntrance" DROP CONSTRAINT "StopEntrance_gtfsStopId_fkey";

-- AlterTable
ALTER TABLE "StopEntrance" DROP COLUMN "gtfsStopId",
ADD COLUMN     "StopId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "StopEntrance" ADD CONSTRAINT "StopEntrance_StopId_fkey" FOREIGN KEY ("StopId") REFERENCES "Stop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
