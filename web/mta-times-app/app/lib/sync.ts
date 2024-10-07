import path from 'path';
import { CSVStation } from './definitions';
import { loadRoutesFromStaticFiles } from './gtfsHelpers/routes';
import { loadStopsFromStaticFiles } from './gtfsHelpers/stops';
import prisma from './prisma';
import { parseCSV } from "./utils";

/**
 * Syncs data from the static gtfs files and populates the database.
 */
export const syncGTFSData = async () => {
    // Stations data
    const stationsPath = path.join(process.cwd(), 'app', 'lib', 'staticGTFS', 'stations.csv');
    const parsedStations = parseCSV(stationsPath);

    const stationsMap = new Map<string, CSVStation>();
    const stations: CSVStation[] = parsedStations.map((data) => {
        const station: CSVStation = {
            stopId: data["GTFS Stop ID"],
            northDirectionLabel: data["North Direction Label"],
            southDirectionLabel: data["South Direction Label"],
            division: data["Division"],
            line: data["Line"],
            stopName: data["Stop Name"],
            ada: data["ADA"],
            adaNotes: data["ADA Notes"]
        };

        stationsMap.set(station.stopId, station);
        return station;
    });

    // Setup Stops

    const stops = await loadStopsFromStaticFiles();

    stops.forEach(stop => {
        const station = stationsMap.get(stop.gtfsStop.stop_id);
        if (station != null) {
            stop.northDirectionLabel = station.northDirectionLabel;
            stop.southDirectionLabel = station.southDirectionLabel;
            stop.ada = station.ada;
            stop.adaNotes = station.adaNotes;
        } else {
            // This happens for some reason so just set a default text and log it.
            console.error(`Unable to map station to GTFS stop. GTFS ID: ${stop.gtfsStop.stop_id}`)
            stop.northDirectionLabel = "";
            stop.southDirectionLabel = "";
            stop.ada = "";
            stop.adaNotes = "";
        }
    });

    // Setup Routes
    const routes = await loadRoutesFromStaticFiles()
    // Delete all records from the Route table
    if (routes != null && routes.length > 0) {
        await prisma.route.deleteMany({});
    } else {
        throw Error('Unable to parse and load static GTFS routes.')
    }

    // maps a route's GTFS ID to its corresponding server ID.
    const routeGTFSIdMap = new Map<string, number>()

    for (const route of routes) {
        try {
            const createdRoute = await prisma.route.create({
                data: {
                    gtfsRouteId: route.gtfsRoute.route_id,
                    agencyId: route.gtfsRoute.agency_id,
                    shortName: route.gtfsRoute.route_short_name,
                    longName: route.gtfsRoute.route_long_name,
                    type: route.gtfsRoute.route_type,
                    routeDescription: route.gtfsRoute.route_desc,
                    url: route.gtfsRoute.route_url,
                    color: route.gtfsRoute.route_color,
                    textColor: route.gtfsRoute.route_text_color,
                    liveFeedURL: route.liveFeedUrl,
                },
            })
            routeGTFSIdMap.set(route.gtfsRoute.route_id, createdRoute.id)

            console.log(`Created route with ID: ${createdRoute.id}`)
        } catch (error) {
            console.error(`Error creating database for route: ${route}`, error);
            throw error;
        }
    }

    console.log(`Finished creating routes ✅`);

    // Delete all records from the Stop table
    if (stops != null && stops.length > 0) {
        await prisma.stop.deleteMany({});
    } else {
        throw Error('Unable to parse and load static GTFS stops.')
    }

    for (const stop of stops) {
        try {
            const routeServerIds = stop.routes.map(route => {
                const serverId = routeGTFSIdMap.get(route.gtfsRoute.route_id)
                return { id: serverId }
            })

            const createdStop = await prisma.stop.create({
                data: {
                    gtfsStopId: stop.gtfsStop.stop_id,
                    name: stop.gtfsStop.stop_name,
                    lat: stop.gtfsStop.stop_lat,
                    lon: stop.gtfsStop.stop_lon,
                    northDirectionLabel: stop.northDirectionLabel,
                    southDirectionLabel: stop.southDirectionLabel,
                    ada: stop.ada,
                    adaNotes: stop.adaNotes,
                    locationType: stop.gtfsStop.location_type,
                    parentStation: stop.gtfsStop.parent_station,
                    routes: {
                        connect: routeServerIds
                    }
                },
            })

            console.log(`Created stop with ID: ${createdStop.id}`)
        } catch (error) {
            console.error(`Error creating database for stop: ${stop}`, error);
            throw error;
        }
    }

    console.log(`Finished creating stops ✅`)

    // Setup StopTimes

    // Setup Trips

    // Close Prisma
    await prisma.$disconnect();
};

/**
 * Downloads and updates the latest static GTFS files.
 */
export const updateStaticGTFS = async () => {

}