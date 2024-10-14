import { Prisma } from '@prisma/client';
import { fetchStopByLatLon, fetchStops } from 'lib/gtfsHelpers/stops';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        let lat = undefined;
        let lon = undefined;
        if (request.nextUrl.searchParams != undefined) {
            lat = request.nextUrl.searchParams.get("lat") as string;
            lon = request.nextUrl.searchParams.get("lon") as string;
        }

        let stops: (Prisma.StopGetPayload<{ include: { entrances: true, routes: true } }>)[]
        if (lat != undefined && lon != undefined) {
            console.log(`/api/stops fetchStopByLatLon`)
            stops = await fetchStopByLatLon(Number(lat), Number(lon)) as unknown as (Prisma.StopGetPayload<{ include: { entrances: true, routes: true } }>)[];
        } else {
            console.log(`/api/stops fetchStops`)

            stops = await fetchStops() as unknown as (Prisma.StopGetPayload<{ include: { entrances: true, routes: true } }>)[];
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