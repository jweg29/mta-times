import { GTFSTrip } from '@prisma/client';
import { GTFSTripData } from 'lib/definitions';
import prisma from 'lib/prisma';
import path from 'path';
import { parseCSV } from '../utils';

export const fetchAllTrips = async (): Promise<GTFSTrip[]> => {
    console.log(`fetchAllTrips`);
    try {
        const gtfsTrips = await prisma.gTFSTrip.findMany();
        console.log(`${gtfsTrips.length} static trips fetched`);
        return gtfsTrips;
    } catch (error) {
        console.error('Error (fetchAllTrips) fetching GTFS trips:', error);
        return [];
    }
};

export const loadTripsFromStaticFiles = async (): Promise<GTFSTripData[]> => {
    console.log(`loadTripsFromStaticFiles`);
    try {
        const tripsPath = path.join(process.cwd(), 'app', 'lib', 'staticGTFS', 'trips.txt');
        const gtfsTrips: GTFSTripData[] = parseCSV(tripsPath);
        console.log(`${gtfsTrips.length} static trips loaded`);
        return gtfsTrips;
    } catch (error) {
        console.error('Error (loadTripsFromStaticFiles) fetching GTFS trips:', error);
        return [];
    }
}

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
        console.error('Error (getTripsByTripIds) no staticTrips found.');
        return [];
    }

    console.log(`Begin trip mapping: ${staticTrips.length} static trips and ${liveTripIds.length} live trips.`)

    for (const liveTripId of liveTripIds) {
        // findMany where liveTripId matches
        let modifiedLiveTripId = liveTripId;
        if (liveTripId.split("..").length > 0) {
            modifiedLiveTripId = liveTripId.split("..")[0];
        }

        const matchingTrips = await prisma.gTFSTrip.findMany({
            where: {
                trip_id: {
                    contains: modifiedLiveTripId,
                },
            },
        })

        if (matchingTrips.length == 0) {
            console.error(`Error (getTripsByTripIds) no matching trips found for liveTripId: ${liveTripId}`);
            continue;
        }

        filteredTrips.push(...matchingTrips);
    }

    return filteredTrips;
};
