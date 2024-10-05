import path from 'path';
import { Stop } from "./definitions";
import { fetchAllStops } from "./gtfsHelpers/stops";
import { parseCSV } from "./utils";

/**
 * Syncs data from the static gtfs files and populates the database.
 */
export const syncGTFSData = async () => {
    // Stations data
    const stationsPath = path.join(process.cwd(), 'app', 'lib', 'staticGTFS', 'stations.csv');
    const parsedStops: Stop[] = parseCSV(stationsPath);

    // Setup Stops
    const stops = await fetchAllStops();

    // Setup Routes

    // Setup StopTimes

    // Setup Trips
};

/**
 * Downloads and updates the latest static GTFS files.
 */
export const updateStaticGTFS = async () => {

}