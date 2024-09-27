import { Departure } from 'lib/definitions';
import { NextRequest, NextResponse } from 'next/server';
import { getStopById, getStopTimesByStopId, getTripsByTripIds } from '../../lib/gtfs';
import { getRealtimeTripUpdates } from '../../lib/realtime';

export async function GET(request: NextRequest) {
    console.log(`api/departures`)
    const stopId = request.nextUrl.searchParams.get("stopId");

    if (typeof stopId !== 'string') {
        return NextResponse.json(
            { error: 'Invalid stop ID' },
            {
                status: 400,
            }
        );
    }

    const stop = getStopById(stopId);
    if (!stop) {
        return NextResponse.json(
            { error: 'Stop not found' },
            {
                status: 404,
            }
        );
    }

    /*
    To retrieve departues we need to:
    1. Get the stop times for the stop from the static stop_times.txt file.
    2. Get the trips for those stop times from the static trips.txt file.
    3. Get the realtime updates for those trips from the realtime feed. 
    */
    const staticStopTimes = getStopTimesByStopId(stopId);
    const tripIds = staticStopTimes.map(stopTime => stopTime.trip_id);
    const trips = getTripsByTripIds(tripIds);

    const realtimeUpdates = await getRealtimeTripUpdates();
    const realtimeTripIds = realtimeUpdates.map(update => update.tripUpdate?.trip?.tripId);
    //console.log(`realtimeTripIds:\n ${realtimeTripIds}`)

    /*
    - Go through each trip update
    - Find the update with my stop
    - Store each time
    - Sort by upcoming
    - Seperate by direction
    */

    // Debugging purposes: Let's filter for trips that only have realtime updates.
    const stopTimesWithRealttimeUpdates = staticStopTimes.filter(stopTime => realtimeTripIds.includes(stopTime.trip_id));

    if (stopTimesWithRealttimeUpdates.length === 0) {
        return NextResponse.json(
            { error: 'No realtime updates found for any trips at this stop' },
            {
                status: 404,
            }
        );
    }

    const departures: Departure[] = stopTimesWithRealttimeUpdates
        .map(stopTime => {
            // Was this trip included in the real time feed response?
            const isRealtime = realtimeTripIds.includes(stopTime.trip_id);
            if (!isRealtime) {
                console.log(`No realtime update for trip ${stopTime.trip_id}`);
            }

            const realtimeUpdate = realtimeUpdates.find(update => update.tripUpdate?.trip?.tripId === stopTime.trip_id);

            if (realtimeUpdate === undefined) {
                console.log(`No realtime update for trip ${stopTime.trip_id}`);
            }

            const departureTime = isRealtime
                ? new Date(realtimeUpdate!.tripUpdate!.stopTimeUpdate!.find(update => update.stopId === stopId)?.departure?.time! * 1000)
                : new Date(`1970-01-01T${stopTime.departure_time}Z`);

            return {
                trip_id: stopTime.trip_id,
                route_id: trips.find(trip => trip.trip_id === stopTime.trip_id)?.route_id,
                departure_time: departureTime,
                isRealtime,
            };
        })
        .filter(departure => departure.departure_time &&
            !isNaN(departure.departure_time.getTime())) // Filter out invalid or past times
        .sort((a, b) => a.departure_time.getTime() - b.departure_time.getTime());

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