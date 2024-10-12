import path from 'path';
import { GTFSTrip } from '../definitions';
import { parseCSV } from '../utils';

export const fetchAllTrips = async (): Promise<GTFSTrip[]> => {
    const tripsPath = path.join(process.cwd(), 'app', 'lib', 'staticGTFS', 'trips.txt');
    const gtfsTrips: GTFSTrip[] = parseCSV(tripsPath);
    return gtfsTrips;
};

/**
 * Retrieves trips from the static trips.txt filtered by the given tripIds.
 * @param tripIds 
 * @returns an array of Trip objects.
 */
export const getTripsByTripIds = async (liveTripIds: string[]): Promise<GTFSTrip[]> => {
    const staticTrips = await fetchAllTrips();
    const filteredTrips: GTFSTrip[] = [];

    staticTrips.forEach(staticTrip => {
        liveTripIds.forEach(liveTripId => {
            // If the GTFS Trip ID includes the live feed trip ID
            // The last 3 chars of the realtime "..S" for example might not match what is in the GTFS.
            // So chop off the last 3 and then match
            // Also enusre the route matches too.
            const modifiedLiveTripId = liveTripId.slice(0, -3);

            if (staticTrip.trip_id.includes(modifiedLiveTripId) /*&& trip.route_id === route.gtfsRouteId*/) {
                filteredTrips.push(staticTrip);
            }
        })
    });

    return filteredTrips;
};
