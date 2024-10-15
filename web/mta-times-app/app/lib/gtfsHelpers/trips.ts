import path from 'path';
import { GTFSTrip } from '../definitions';
import { parseCSV } from '../utils';

export const fetchAllTrips = async (): Promise<GTFSTrip[]> => {
    console.log(`fetchAllTrips`);
    try {
        const tripsPath = path.join(process.cwd(), 'app', 'lib', 'staticGTFS', 'trips.txt');
        const gtfsTrips: GTFSTrip[] = parseCSV(tripsPath);
        return gtfsTrips;
    } catch (error) {
        console.error('Error (fetchAllTrips) fetching GTFS trips:', error);
        return [];
    }
};

/**
 * Retrieves trips from the static trips.txt filtered by the given tripIds.
 * @param tripIds 
 * @returns an array of Trip objects.
 */
export const getTripsByTripIds = async (liveTripIds: string[], routeIds: string[]): Promise<GTFSTrip[]> => {
    console.log(`getTripsByTripIds`);

    if (liveTripIds.length == 0 || routeIds.length == 0) {
        console.error('Error (getTripsByTripIds) invalid params liveTripIds or routeIds.');
        return [];
    }

    const staticTrips = await fetchAllTrips();
    const filteredTrips: GTFSTrip[] = [];

    // create a map from routeIds
    const routeIdMap = new Map();
    routeIds.forEach(routeId => {
        routeIdMap.set(routeId, true);
    });

    if (staticTrips.length == 0) {
        console.error('Error (getTripsByTripIds) not staticTrips found.');
        return [];
    }

    console.log(`Begin trip mapping: ${staticTrips.length} static trips and ${liveTripIds.length} live trips.`)

    try {
        staticTrips.forEach(staticTrip => {
            liveTripIds.forEach(liveTripId => {
                // If the GTFS Trip ID includes the live feed trip ID
                // 065300_G..S19X002 is an exampl live ID.
                // The last chars of the realtime after the ".." for example might not match what is in the GTFS.
                // So chop off the last 3 and then match
                // Also ensure the route and day matches too TODO.

                const tripSplitValue = liveTripId.split("..");
                let modifiedLiveTripId = liveTripId;
                if (tripSplitValue.length > 0) {
                    modifiedLiveTripId = liveTripId.split("..")[0];
                } else {
                    console.error(`unable to split live trip id: ${liveTripId}`);
                }

                //const modifiedLiveTripId = liveTripId.split("..")[0];

                // if (staticTrip.trip_id.includes(modifiedLiveTripId)) {
                //     routeIdMap.get(staticTrip.route_id)
                //     if (routeIdMap[staticTrip.route_id]) {
                //         //filteredTrips.push(staticTrip);
                //     }
                // }
                /*const today = new Date();
                const dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
                let dayTypeString = ""
                if (dayOfWeek === 0) {
                    dayTypeString = "Sunday";
                } else if (dayOfWeek === 6) {
                    dayTypeString = "Saturday";
                } else {
                    dayTypeString = "Weekday";
                }*/

                if (staticTrip.trip_id.includes(modifiedLiveTripId) &&
                    routeIdMap.get(staticTrip.route_id) /*&&
                    staticTrip.service_id.includes(dayTypeString)*/) {
                    filteredTrips.push(staticTrip);
                }
            })
        });

        return filteredTrips;
    } catch (error) {
        console.error('Error (getTripsByTripIds) mapping static to live trip ids:', error);
        throw error;
        //return [];
    }
};
