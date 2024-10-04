import { fetchDeparturesForStop } from 'lib/gtfsHelpers/departures';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const stopId = request.nextUrl.searchParams.get("stopId");

    if (typeof stopId !== 'string') {
        return NextResponse.json(
            { error: 'Invalid stop ID' },
            { status: 400 }
        );
    }

    const upcomingDepartures = await fetchDeparturesForStop(stopId);

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
