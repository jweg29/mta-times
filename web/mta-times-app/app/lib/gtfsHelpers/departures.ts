import { Route } from "@prisma/client";
import { Departure, RealtimeTrip, Trip } from "lib/definitions";
import { getRealtimeTripUpdates } from "lib/realtime";
import { fetchRoutes } from "./routes";
import { getStopById } from "./stops";
import { getTripsByTripIds } from "./trips";

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
    let realtimeTripUpdates: RealtimeTrip[] = [];// = []TripUpdate();
    const feedURLs = new Set<string>();
    for (const route of stop.routes) {
        feedURLs.add(route.liveFeedURL);
        console.log(`fetching realtimeTripUpdates for route: ${route.gtfsRouteId}`);
    }

    for (const feedURL of Array.from(feedURLs.values())) {
        const updates = await getRealtimeTripUpdates(feedURL);
        realtimeTripUpdates = realtimeTripUpdates.concat(updates);
    }

    // fetch all the trips associated with these updates and form a dictionary.
    const tripMap: Map<string, Trip> = new Map();
    const realtimeTripIds = realtimeTripUpdates.map(update => update.tripUpdate.trip.tripId);
    const routeIds = stop.routes.map(route => route.gtfsRouteId)
    const gtfsTrips = await getTripsByTripIds(realtimeTripIds, routeIds);

    const routes = await fetchRoutes();
    const routeMap: Map<string, Route> = new Map();
    for (const route of routes) {
        routeMap.set(route.gtfsRouteId, route)
    }

    console.log(`route mapping complete`);

    for (const realtimeTrip of realtimeTripUpdates) {
        // live include stuff that doesn't match gtfs
        const modifiedLiveTripId = realtimeTrip.tripUpdate.trip.tripId.split("..")[0];
        const gtfsTrip = gtfsTrips.find(gtfsTrip => gtfsTrip.trip_id.includes(modifiedLiveTripId));

        if (gtfsTrip != null) {
            const trip: Trip = {
                tripId: realtimeTrip.tripUpdate.trip.tripId,
                startDate: realtimeTrip.tripUpdate.trip.startDate,
                scheduleRelationship: realtimeTrip.tripUpdate.trip.scheduleRelationship,
                routeId: realtimeTrip.tripUpdate.trip.routeId,
                route: routeMap.get(realtimeTrip.tripUpdate.trip.routeId),
                gtfsTrip: gtfsTrip,
            };
            /*
            const lastIndex = realtimeTrip.tripUpdate.stopTimeUpdate.length - 1
            let lastStopName;
            if (trip.gtfsTrip.direction_id === "0") {
                lastStopName = (await getStopById(realtimeTrip.tripUpdate.stopTimeUpdate[lastIndex].stopId.slice(0, -1))).name
            } else {
                lastStopName = (await getStopById(realtimeTrip.tripUpdate.stopTimeUpdate[0].stopId.slice(0, -1))).name
            }

            trip.gtfsTrip.trip_headsign = lastStopName
            */

            tripMap.set(realtimeTrip.tripUpdate.trip.tripId, trip);
        } else {
            console.warn(`Could not find trip for: ${realtimeTrip.tripUpdate.trip.tripId}`);
        }
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
            directionId: trip.gtfsTrip.direction_id,
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

function getDepartureDisplayString(departureDate: Date): string {//stopTimeUpdate: StopTimeUpdate): string {
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