import path from 'path';
import { GTFSStop, GTFSTrip, Route, Stop, StopTime } from '../definitions';
import { parseCSV } from '../utils';
import { fetchAllRoutes } from './routes';
import { fetchAllTrips } from './trips';

export const fetchAllStops = async (): Promise<Stop[]> => {
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

    const routes = await fetchAllRoutes()
    const routeMap: Map<string, Route> = new Map();
    routes.forEach(route => {
        routeMap.set(route.gtfsRoute.route_id, route);
    });

    const stops = gtfsStops.map(gtfsStop => {
        const stop: Stop = {
            gtfsStop: gtfsStop,
            routes: []
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
        const routesForStop = new Set<Route>();
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

export const getStopById = async (stopId: string): Promise<Stop | undefined> => {
    const stops = await fetchAllStops();
    return stops.find(stop => stop.gtfsStop.stop_id === stopId);
};