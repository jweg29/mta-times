-- CreateTable
CREATE TABLE "Stop" (
    "id" SERIAL NOT NULL,
    "gtfsStopId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lat" TEXT NOT NULL,
    "lon" TEXT NOT NULL,
    "northDirectionLabel" TEXT NOT NULL,
    "southDirectionLabel" TEXT NOT NULL,
    "ada" TEXT NOT NULL,
    "adaNotes" TEXT NOT NULL,
    "locationType" TEXT NOT NULL,
    "parentStation" TEXT NOT NULL,

    CONSTRAINT "Stop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Route" (
    "id" SERIAL NOT NULL,
    "gtfsRouteId" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "longName" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "routeDescription" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "textColor" TEXT NOT NULL,
    "liveFeedURL" TEXT NOT NULL,
    "shouldDisplay" BOOLEAN NOT NULL DEFAULT true,
    "groupOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StopEntrance" (
    "id" SERIAL NOT NULL,
    "lat" TEXT NOT NULL,
    "lon" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "entryAllowed" BOOLEAN NOT NULL,
    "exitAllowed" BOOLEAN NOT NULL,
    "gtfsStopId" TEXT NOT NULL,
    "stopId" INTEGER,

    CONSTRAINT "StopEntrance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GTFSTrip" (
    "trip_id" TEXT NOT NULL,
    "route_id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "trip_headsign" TEXT NOT NULL,
    "direction_id" TEXT NOT NULL,
    "shape_id" TEXT NOT NULL,

    CONSTRAINT "GTFSTrip_pkey" PRIMARY KEY ("trip_id")
);

-- CreateTable
CREATE TABLE "_StopRoutes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Stop_gtfsStopId_key" ON "Stop"("gtfsStopId");

-- CreateIndex
CREATE UNIQUE INDEX "_StopRoutes_AB_unique" ON "_StopRoutes"("A", "B");

-- CreateIndex
CREATE INDEX "_StopRoutes_B_index" ON "_StopRoutes"("B");

-- AddForeignKey
ALTER TABLE "StopEntrance" ADD CONSTRAINT "StopEntrance_stopId_fkey" FOREIGN KEY ("stopId") REFERENCES "Stop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StopRoutes" ADD CONSTRAINT "_StopRoutes_A_fkey" FOREIGN KEY ("A") REFERENCES "Route"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StopRoutes" ADD CONSTRAINT "_StopRoutes_B_fkey" FOREIGN KEY ("B") REFERENCES "Stop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
