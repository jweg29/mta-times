import { syncGTFSData } from 'lib/sync';
import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic'; // defaults to auto

export async function GET(request: NextRequest) {
    console.log(`syncing...⏳`)

    try {
        await syncGTFSData();
        return NextResponse.json({ "response": "synced ✅" }, { status: 200 });
    } catch (error) {
        console.error(`Failed to sync GTFS data: ${error}`);
        return NextResponse.json(
            { error: `Failed to sync GTFS data: ${error}` },
            { status: 500 }
        );
    }
}
