import { Departure, Route, Trip } from 'lib/definitions';
import { getRealtimeTripUpdates } from 'lib/realtime';
import { NextRequest, NextResponse } from 'next/server';
import { fetchAllRoutes, getStopById, getTripsByTripIds } from '../../lib/gtfs';

export async function GET(request: NextRequest) {
    const stopId = request.nextUrl.searchParams.get("stopId");

    if (typeof stopId !== 'string') {
        return NextResponse.json(
            { error: 'Invalid stop ID' },
            { status: 400 }
        );
    }

    const stop = await getStopById(stopId);
    if (!stop) {
        return NextResponse.json(
            { error: 'Stop not found' },
            { status: 404 }
        );
    }

    /*
    To retrieve departues we need to:
    1. Fetch realtime updates from getRealtimeTripUpdates().
    2. Get tripIds from each trip update and fetch the trip details.
    3. Filter out trips that do not server the current stop.
    4. Sort and filter out the remaining departure time?
    */

    // A stop should have one realtime feed type i think?
    const realtimeTripUpdates = await getRealtimeTripUpdates(stop.routes[0].liveFeedUrl)

    // fetch all the trips associated with these updates and form a dictionary.
    const tripMap: Map<string, Trip> = new Map();
    const realtimeTripIds = realtimeTripUpdates.map(update => update.tripUpdate.trip.tripId);
    const gtfsTrips = await getTripsByTripIds(realtimeTripIds);

    const routes = await fetchAllRoutes();
    const routeMap: Map<string, Route> = new Map();
    for (const route of routes) {
        routeMap.set(route.gtfsRoute.route_id, route)
    }

    realtimeTripUpdates.forEach(realtimeTrip => {
        const gtfsTrip = gtfsTrips.find(gtfsTrip => gtfsTrip.trip_id.includes(realtimeTrip.tripUpdate.trip.tripId));

        if (gtfsTrip != null) {
            const trip: Trip = {
                tripId: realtimeTrip.tripUpdate.trip.tripId,
                startDate: realtimeTrip.tripUpdate.trip.startDate,
                scheduleRelationship: realtimeTrip.tripUpdate.trip.scheduleRelationship,
                routeId: realtimeTrip.tripUpdate.trip.routeId,
                route: routeMap.get(realtimeTrip.tripUpdate.trip.routeId),
                directionId: realtimeTrip.tripUpdate.trip.directionId,
                gtfsTrip: gtfsTrip,
            };
            tripMap.set(realtimeTrip.tripUpdate.trip.tripId, trip);
        } else {
            console.log(`Could not find trip for ${realtimeTrip.tripUpdate.trip.tripId}`);
        }
    });

    const departures: Departure[] = realtimeTripUpdates.flatMap(realtimeTrip => {
        // We need the trip and the stop time updates that are only relevant for our stopId.
        const trip = tripMap.get(realtimeTrip.tripUpdate.trip.tripId);
        if (trip == null) {
            console.log(`Could not find trip for ${realtimeTrip.tripUpdate.trip.tripId}`);
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
            departureDisplayShort: timeDisplayString
        };

        return departure;
    })

    // Sort departures by ascending time (earliest first)
    departures.sort((a, b) => new Date(a.departure_time).getTime() - new Date(b.departure_time).getTime());

    // filter out the past departures.
    const upcomingDepartures = departures.filter(departure => {
        const departureDate = new Date(departure.departure_time);
        return departureDate.getTime() > Date.now();
    });

    try {
        return NextResponse.json(
            upcomingDepartures,
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error('Error fetching GTFS stops:', error);
        return NextResponse.json(
            { error: 'Failed to fetch GTFS stops' },
            {
                status: 500,
            }
        );
    }
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
            timeDisplayString = `${hoursDifference} hours`;
        } else {
            timeDisplayString = `${daysDifference} days`;
        }
    }

    return timeDisplayString;
}