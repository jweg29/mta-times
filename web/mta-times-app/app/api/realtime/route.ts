import { NextRequest, NextResponse } from 'next/server';
import { getRealtimeTripUpdates } from '../../lib/realtime';

export async function GET(request: NextRequest) {
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