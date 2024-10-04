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
export const getTripsByTripIds = async (tripIds: string[]): Promise<GTFSTrip[]> => {
    const trips = await fetchAllTrips();
    const filteredTrips: GTFSTrip[] = [];

    trips.forEach(trip => {
        tripIds.forEach(tripId => {
            if (trip.trip_id.includes(tripId)) {
                filteredTrips.push(trip);
            }
        })
    });

    return filteredTrips;
};
