import { Departure, Trip } from 'lib/definitions';
import { getRealtimeTripUpdates } from 'lib/realtime';
import { NextRequest, NextResponse } from 'next/server';
import { getStopById, getTripsByTripIds } from '../../lib/gtfs';

export async function GET(request: NextRequest) {
    const stopId = request.nextUrl.searchParams.get("stopId");

    if (typeof stopId !== 'string') {
        return NextResponse.json(
            { error: 'Invalid stop ID' },
            { status: 400 }
        );
    }

    const stop = getStopById(stopId);
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

    const realtimeTripUpdates = await getRealtimeTripUpdates()

    // fetch all the trips associated with these updates and form a dictionary.
    const tripMap: Map<string, Trip> = new Map();
    const realtimeTripIds = realtimeTripUpdates.map(update => update.tripUpdate.trip.tripId);
    const gtfsTrips = getTripsByTripIds(realtimeTripIds);

    realtimeTripUpdates.forEach(realtimeTrip => {
        const gtfsTrip = gtfsTrips.find(gtfsTrip => gtfsTrip.trip_id.includes(realtimeTrip.tripUpdate.trip.tripId));

        if (gtfsTrip != null) {
            const trip: Trip = {
                tripId: realtimeTrip.tripUpdate.trip.tripId,
                startDate: realtimeTrip.tripUpdate.trip.startDate,
                scheduleRelationship: realtimeTrip.tripUpdate.trip.scheduleRelationship,
                routeId: realtimeTrip.tripUpdate.trip.routeId,
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
            console.log(`No stop time updates found for ${stopId} in ${realtimeTrip.tripUpdate.trip.tripId}`);
            return [];
        }

        // there should only be one stopTimeUpdate I think?
        if (stopTimeUpdates.length > 1) {
            throw new Error("Multiple stop time updates found");
        }
        const stopTimeUpdate = stopTimeUpdates[0];

        const unixTimestampString = stopTimeUpdate.departure["time"] as string
        // Convert the Unix timestamp to a number and multiply by 1000 (to get milliseconds)
        const unixTimestamp = parseInt(unixTimestampString) * 1000;

        // Create a Date object from the timestamp
        const departureDate = new Date(unixTimestamp);

        // 
        //const departureDate = new Date(departure.departure_time)

        // Format the time in 12-hour format with AM/PM
        const formattedTime = departureDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            //second: '2-digit',
            hour12: true,  // 12-hour format with AM/PM
        });

        const timeDifference = departureDate.getTime() - Date.now();

        // Convert the difference into a human-readable format
        const minutesDifference = Math.floor(Math.abs(timeDifference) / (1000 * 60));
        const hoursDifference = Math.floor(Math.abs(timeDifference) / (1000 * 60 * 60));
        const daysDifference = Math.floor(Math.abs(timeDifference) / (1000 * 60 * 60 * 24));

        let timeDisplayString = ""
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

    try {
        return NextResponse.json(
            departures,
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