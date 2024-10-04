import { NextRequest, NextResponse } from 'next/server';
import { getRealtimeTripUpdates } from '../../lib/realtime';

export async function GET(request: NextRequest) {

    const routeId = request.nextUrl.searchParams.get("routeId");

    if (typeof routeId !== 'string') {
        /*return NextResponse.json(
            { error: 'Invalid rout Id' },
            { status: 400 }
        );*/
    }

    /*const stop = getStopById(stopId);
    if (!stop) {
        return NextResponse.json(
            { error: 'Stop not found' },
            { status: 404 }
        );
    }*/

    try {
        const realtimeTrips = await getRealtimeTripUpdates();
        return NextResponse.json(
            { realtimeTrips: realtimeTrips },
            { status: 200 });
    } catch (error) {
        console.error('Error fetching GTFS Realtime updates:', error);
        return NextResponse.json(
            { error: `Error fetching GTFS Realtime updates: ${error}` },
            {
                status: 500,
            }
        );
    }
}