import { Route } from "@prisma/client";
import { Departure, GTFSStop, RealtimeTrip, Trip } from "lib/definitions";
import { getRealtimeTripUpdates } from "lib/realtime";
import { fetchRoutes } from "./routes";
import { getStopById, loadGTFSStopsFromStaticFiles } from "./stops";

export const fetchDeparturesForStop = async (stopId: string): Promise<Departure[]> => {
    console.log(`fetchDeparturesForStop with id: ${stopId}`);
    /*
    To retrieve departues we need to:
    1. Fetch realtime updates from getRealtimeTripUpdates().
    2. Get tripIds from each trip update and fetch the trip details.
    3. Filter out trips that do not serve the current stop.
    4. Sort and filter out the remaining departure time?
    */

    const stop = await getStopById(stopId);
    console.log(`getStopById id: ${stopId}`);

    // A stop can have multiple realtime feeds (e.g. A C G)
    // 1. Get all realtime feed urls
    // 2. Fetch updates for each url
    // 3. Merge all trip updates together
    let realtimeTripUpdates: RealtimeTrip[] = [];
    const feedURLs = new Set<string>();
    for (const route of stop.routes) {
        feedURLs.add(route.liveFeedURL);
        console.log(`fetching realtimeTripUpdates for route: ${route.gtfsRouteId}`);
    }

    for (const feedURL of Array.from(feedURLs.values())) {
        const updates = await getRealtimeTripUpdates(feedURL);
        realtimeTripUpdates = realtimeTripUpdates.concat(updates);
    }

    console.log(`finished fetching realtimeTripUpdates`);

    const tripMap: Map<string, Trip> = new Map();
    const realtimeTripIds = realtimeTripUpdates.map(update => update.tripUpdate.trip.tripId);

    const routes = await fetchRoutes();
    const routeMap: Map<string, Route> = new Map();
    for (const route of routes) {
        routeMap.set(route.gtfsRouteId, route)
    }

    console.log(`route mapping complete`);

    //const headsignMap = await loadHeadsignMapFromStaticFile();

    const allStops = await loadGTFSStopsFromStaticFiles();
    // map these stops by stopId
    const stopIdMap = new Map<string, GTFSStop>();
    for (const stop of allStops) {
        stopIdMap.set(stop.stop_id, stop);
    }

    for (const realtimeTrip of realtimeTripUpdates) {
        // Example live trip ID: 093050_C..N04R
        // OR 094150_FS.S01R
        // The char after the ".." represents the directions.
        // 126250_L..S
        let tripIdSegments
        tripIdSegments = realtimeTrip.tripUpdate.trip.tripId.split("..");
        if (tripIdSegments.length == 1) {
            tripIdSegments = realtimeTrip.tripUpdate.trip.tripId.split(".");
        }

        const directionId = tripIdSegments.length > 1 ? tripIdSegments[1][0] : null;
        /*const tripPathId = tripIdSegments[1];

        const tripPathKey = tripIdSegments[0][tripIdSegments[0].length - 1] + tripPathId
        const tripPath = headsignMap[tripPathKey];

        if (tripPath == null) {
            console.error(`ERROR: No trip path found for ${tripPathKey}`);
        }*/

        if (directionId == null) {
            console.error(`ERROR: No direction found for ${realtimeTrip.tripUpdate.trip.tripId}`);
            continue;
        }

        // TODO: Fix headsign bugs
        // What is the last stop in these
        let lastStopName: string = "Unknown"
        try {
            const stopTimeUpdates = realtimeTrip.tripUpdate.stopTimeUpdate;
            // Sometimes there are no stopTimeUpdates?
            if (stopTimeUpdates.length > 0) {
                const lastStopTimeUpdate = stopTimeUpdates[stopTimeUpdates.length - 1];
                // Ignore last char since that represents the direction
                const lastStopId = lastStopTimeUpdate.stopId.slice(0, -1);
                lastStopName = stopIdMap.get(lastStopId).stop_name;
            }
        } catch {
            console.error(`ERROR: failed to calcualate last stop for realtimeTrip: ${realtimeTrip}`);
        } finally {

        }

        const trip: Trip = {
            tripId: realtimeTrip.tripUpdate.trip.tripId,
            startDate: realtimeTrip.tripUpdate.trip.startDate,
            scheduleRelationship: realtimeTrip.tripUpdate.trip.scheduleRelationship,
            routeId: realtimeTrip.tripUpdate.trip.routeId,
            route: routeMap.get(realtimeTrip.tripUpdate.trip.routeId),
            headsign: lastStopName,//tripPath?.headsign,
            directionId: directionId,
        };

        tripMap.set(realtimeTrip.tripUpdate.trip.tripId, trip);
    }

    console.log(`trip matching complete`);

    const departures: Departure[] = realtimeTripUpdates.flatMap(realtimeTrip => {
        // We need the trip and the stop time updates that are only relevant for our stopId.
        const trip = tripMap.get(realtimeTrip.tripUpdate.trip.tripId);
        if (trip == null) {
            return [];
        }

        const stopTimeUpdates = realtimeTrip.tripUpdate.stopTimeUpdate.filter(update => update.stopId.startsWith(stopId));

        if (stopTimeUpdates.length == 0) {
            //console.log(`No stop time updates found for ${stopId} in ${realtimeTrip.tripUpdate.trip.tripId}`);
            return [];
        }

        // there should only be one stopTimeUpdate I think?
        if (stopTimeUpdates.length > 1) {
            console.log("Multiple stop time updates found")
            throw new Error("Multiple stop time updates found");
        }

        const stopTimeUpdate = stopTimeUpdates[0];
        const unixTimestampString = stopTimeUpdate.departure["time"] as string
        // Convert the Unix timestamp to a number and multiply by 1000 (to get milliseconds)
        const unixTimestamp = parseInt(unixTimestampString) * 1000;

        // Create a Date object from the timestamp
        const departureDate = new Date(unixTimestamp);
        let timeDisplayString = getDepartureDisplayString(departureDate);

        const departure: Departure = {
            trip: trip,
            departure_time: departureDate.toUTCString(),
            isRealtime: true,
            departureDisplay: timeDisplayString,
            departureDisplayShort: timeDisplayString,
            directionId: trip.directionId,
        };

        return departure;
    })

    console.log(`departure creation complete`);

    // Sort departures by ascending time (earliest first)
    departures.sort((a, b) => new Date(a.departure_time).getTime() - new Date(b.departure_time).getTime());

    // filter out the past departures.
    const upcomingDepartures = departures.filter(departure => {
        const departureDate = new Date(departure.departure_time);
        const timeDifference = departureDate.getTime() - Date.now();
        // 120000 / 2 minute buffer
        return departureDate.getTime() > (Date.now() - 120000);
    });

    return upcomingDepartures;
}

function getDepartureDisplayString(departureDate: Date): string {
    let timeDisplayString = "";
    const timeDifference = departureDate.getTime() - Date.now();

    // Convert the difference into a human-readable format
    const minutesDifference = Math.floor(Math.abs(timeDifference) / (1000 * 60));
    const hoursDifference = Math.floor(Math.abs(timeDifference) / (1000 * 60 * 60));
    const daysDifference = Math.floor(Math.abs(timeDifference) / (1000 * 60 * 60 * 24));

    if (timeDifference < 0) {
        // Time is in the past
        if (minutesDifference < 60) {
            if (minutesDifference == 0) {
                timeDisplayString = `now`;
            } else {
                if (minutesDifference == 1) {
                    timeDisplayString = `${minutesDifference} minute ago`;
                } else {
                    timeDisplayString = `${minutesDifference} minutes ago`;
                }
            }
        } else if (hoursDifference < 24) {
            timeDisplayString = `${hoursDifference} hours ago`;
        } else {
            timeDisplayString = `${daysDifference} days ago`;
        }
    } else {
        // Time is in the future
        if (minutesDifference < 60) {
            if (minutesDifference == 0) {
                timeDisplayString = `now`;
            } else if (minutesDifference == 1) {
                timeDisplayString = `${minutesDifference} minute`;
            } else {
                timeDisplayString = `${minutesDifference} minutes`;
            }
        } else if (hoursDifference < 24) {
            if (hoursDifference == 1) {
                timeDisplayString = `${hoursDifference} hour`;
            } else {
                timeDisplayString = `${hoursDifference} hours`;
            }
        } else {
            timeDisplayString = `${daysDifference} days`;
        }
    }

    return timeDisplayString;
}