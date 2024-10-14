import { Route, Stop } from '@prisma/client';
import { fetchStopByLatLon, fetchStops } from 'lib/gtfsHelpers/stops';
import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic'; // defaults to auto

export async function GET(request: NextRequest) {
    try {
        const lat = request.nextUrl.searchParams.get("lat") as string;
        const lon = request.nextUrl.searchParams.get("lon") as string;

        let stops: Stop & { stop: Route[] }[]
        if (lat != undefined && lon != undefined) {
            console.log(`/api/stops fetchStopByLatLon`)
            stops = await fetchStopByLatLon(Number(lat), Number(lon)) as unknown as Stop & { stop: Route[] }[];
        } else {
            console.log(`/api/stops fetchStops`)
            stops = await fetchStops() as unknown as Stop & { stop: Route[] }[];
        }

        return NextResponse.json(
            stops,
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