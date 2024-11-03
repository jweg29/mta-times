import { getRealtimeTripUpdates } from 'lib/realtime';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        //const liveFeedURL = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace";
        const liveFeedURL = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-l";

        const liveFeedUpdates = await getRealtimeTripUpdates(liveFeedURL);
        return NextResponse.json(
            liveFeedUpdates,
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