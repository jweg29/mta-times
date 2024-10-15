import { GTFSTrip, Prisma, Route, Stop } from '@prisma/client';
import prisma from 'lib/prisma';
import path from 'path';
import { GTFSStop, RouteData, StopData, StopTime } from '../definitions';
import { parseCSV } from '../utils';
import { loadRoutesFromStaticFiles } from './routes';
import { fetchAllTrips } from './trips';

export const fetchStops = async (): Promise<Prisma.StopGetPayload<{ include: { entrances: true, routes: true } }>[]> => {
    const stops = await prisma.stop.findMany({
        include: {
            routes: true,
            entrances: true,
        },
        orderBy: {
            name: 'asc',
        },
    });
    return stops;
}

/**
 * 
 * @param lat
 * @param lon 
 * @returns The 10 closest stops from the given lat lon.
 */
export const fetchStopByLatLon = async (lat: number, lon: number): Promise<Prisma.StopGetPayload<{ include: { entrances: true, routes: true } }>[]> => {
    const stops = await fetchStops();

    console.log(`fetched ${stops.length} stops`);

    // Radius of the Earth in kilometers
    const earthRadiusKm = 6371;

    // Haversine formula to calculate distance between two latitude/longitude points
    const haversineDistance = (lat1, lon1, lat2, lon2) => {
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadiusKm * c;
    };

    // Map each stop to an object with the distance, sort by distance, and return the top `numStops` closest stops
    return stops
        .map((stop) => ({
            stop,
            distance: haversineDistance(lat, lon, stop.lat, stop.lon),
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 10)
        .map((item) => item.stop as unknown as (Prisma.StopGetPayload<{ include: { entrances: true, routes: true } }>)); // Type assertion to ensure TypeScript understands this is a Stop object
}

export const loadStopsFromStaticFiles = async (): Promise<StopData[]> => {
    const stopsPath = path.join(process.cwd(), 'app', 'lib', 'staticGTFS', 'stops.txt');
    const parsedStops: GTFSStop[] = parseCSV(stopsPath);

    // Filter for only parent stops.
    const gtfsStops = parsedStops.filter(stop =>
        // We only want to display parent stops to prevent duplicates.
        stop.parent_station === '' &&
        stop.location_type === '1'
    );

    const trips = await fetchAllTrips();
    const tripMap: Map<string, GTFSTrip> = new Map();
    trips.forEach(trip => {
        tripMap.set(trip.trip_id, trip);
    });

    const routes = await loadRoutesFromStaticFiles()
    const routeMap: Map<string, RouteData> = new Map();
    routes.forEach(route => {
        routeMap.set(route.gtfsRoute.route_id, route);
    });

    const stops = gtfsStops.map(gtfsStop => {
        const stop: StopData = {
            gtfsStop: gtfsStop,
            routes: [],
            northDirectionLabel: '',
            southDirectionLabel: '',
            ada: '',
            adaNotes: ''
        }
        return stop;
    })

    const allStopTimes = await fetchAllStopTimes();

    // The stops Ids for stop times are for child stops. They have an N or S appended to the end of the Id. We only care about the parent station id so we strip the last character off of these ids.
    allStopTimes.forEach(stopTime => {
        stopTime.stop_id = stopTime.stop_id.slice(0, -1);
    })

    const stopTimesMap: Map<string, StopTime[]> = new Map();
    allStopTimes.forEach(stopTime => {
        const stopTimes = stopTimesMap.get(stopTime.stop_id);
        if (stopTimes) {
            stopTimes.push(stopTime);
        } else {
            stopTimesMap.set(stopTime.stop_id, [stopTime]);
        }
    });

    for (const stop of stops) {
        const routesForStop = new Set<RouteData>();
        const stopTimes = stopTimesMap.get(stop.gtfsStop.stop_id);

        if (stopTimes == null || stopTimes.length == 0) {
            console.log(`No stop times found for stop: ${stop.gtfsStop.stop_id}`);
            continue;
        }

        for (const stopTime of stopTimes) {
            // get the trip from the stop time.
            const trip = tripMap.get(stopTime.trip_id);
            if (trip) {
                // get the route from the trip.
                const route = routeMap.get(trip.route_id);
                if (route) {
                    routesForStop.add(route);
                } else {
                    console.log('No route found for trip: ', trip);
                }
            } else {
                console.log('No trip found for stop time: ', stopTime);
            }
        }

        stop.routes = Array.from(routesForStop);
    };

    return stops;
};

export const fetchAllStopTimes = async (): Promise<StopTime[]> => {
    const stopTimesPath = path.join(process.cwd(), 'app', 'lib', 'staticGTFS', 'stop_times.txt');
    const stopTimes: StopTime[] = parseCSV(stopTimesPath);
    return stopTimes;
};


/**
 * Retrieves departure times from the static stop_times.txt filtered by the given stopId.
 * @param stopId 
 * @returns an array of StopTime objects.
 */
export const getStopTimesByStopId = async (stopId: string): Promise<StopTime[]> => {
    const stopTimes = await fetchAllStopTimes();
    return stopTimes.filter(stopTime => stopTime.stop_id.startsWith(stopId));
};

export const getStopById = async (stopId: string): Promise<(Stop & { routes: Route[] }) | undefined> => {
    const stop = await prisma.stop.findFirst({
        where: {
            gtfsStopId: stopId
        },
        include: {
            routes: true,
        }
    })
    return stop
};