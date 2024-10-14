-- CreateTable
CREATE TABLE "StopEntrance" (
    "id" SERIAL NOT NULL,
    "lat" TEXT NOT NULL,
    "lon" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "entryAllowed" BOOLEAN NOT NULL,
    "exitAllowed" BOOLEAN NOT NULL,
    "gtfsStopId" TEXT,

    CONSTRAINT "StopEntrance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StopEntrance" ADD CONSTRAINT "StopEntrance_gtfsStopId_fkey" FOREIGN KEY ("gtfsStopId") REFERENCES "Stop"("gtfsStopId") ON DELETE SET NULL ON UPDATE CASCADE;
