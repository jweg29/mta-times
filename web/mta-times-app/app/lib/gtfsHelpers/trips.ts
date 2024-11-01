import { GTFSTrip } from '@prisma/client';
import { readFileSync } from 'fs';
import { GTFSTripData, TripPath } from 'lib/definitions';
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

export const loadHeadsignMapFromStaticFile = async (): Promise<{ [key: string]: TripPath }> => {
    console.log(`loadHeadsignMapFromStaticFile`);
    try {

        const tripPathsPath = path.join(process.cwd(), 'app', 'lib', 'staticGTFS', 'headsignMap.json');
        const fileContent = readFileSync(tripPathsPath, 'utf8');
        const tripPathsDict: { [key: string]: TripPath } = JSON.parse(fileContent);
        return tripPathsDict;
    } catch (error) {
        console.error('Error (loadTripsFromStaticFiles) fetching GTFS trips:', error);
        return {};
    }
}

/**
 * Retrieves trips from the database filtered by the given tripIds.
 * @param tripIds 
 * @returns an array of Trip objects.
 */
export const getTripsByTripIds = async (liveTripIds: string[], routeIds: string[]): Promise<GTFSTrip[]> => {
    console.log(`getTripsByTripIds`);

    if (liveTripIds.length == 0 || routeIds.length == 0) {
        console.error('Error (getTripsByTripIds) invalid params liveTripIds or routeIds.');
        return [];
    }

    const filteredTrips: GTFSTrip[] = [];

    // create a map from routeIds
    const routeIdMap = new Map();
    routeIds.forEach(routeId => {
        routeIdMap.set(routeId, true);
    });

    // try filtering live trips by route?
    //const filteredLiveTripIds = liveTripIds.filter(liveTripId => liveTripId.includes())

    console.log(`Begin trip mapping: ${liveTripIds.length} live trips.`)

    // This seems to create a bottleneck because we can have >100 live trips returned by the feed.
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
