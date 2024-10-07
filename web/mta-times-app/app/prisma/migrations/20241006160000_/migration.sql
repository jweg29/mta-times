-- CreateTable
CREATE TABLE "stop" (
    "id" SERIAL NOT NULL,
    "northDirectionLabel" TEXT NOT NULL,
    "southDirectionLabel" TEXT NOT NULL,
    "ada" TEXT NOT NULL,
    "adaNotes" TEXT NOT NULL,
    "gtfsStopId" INTEGER NOT NULL,

    CONSTRAINT "stop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gtfs_subway_stop" (
    "id" SERIAL NOT NULL,
    "stopId" TEXT NOT NULL,
    "stopName" TEXT NOT NULL,
    "stopLat" TEXT NOT NULL,
    "stopLon" TEXT NOT NULL,
    "locationType" TEXT NOT NULL,
    "parentStation" TEXT NOT NULL,

    CONSTRAINT "gtfs_subway_stop_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stop_gtfsStopId_key" ON "stop"("gtfsStopId");

-- AddForeignKey
ALTER TABLE "stop" ADD CONSTRAINT "stop_gtfsStopId_fkey" FOREIGN KEY ("gtfsStopId") REFERENCES "gtfs_subway_stop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
