import { updateStaticGTFS } from 'lib/sync';
import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic' // defaults to auto

export async function GET(request: NextRequest) {
    console.log(`syncing...⏳`)

    try {
        const response = await updateStaticGTFS();
        return response;
    } catch (error) {
        console.error(`Failed to update static GTFS data: ${error}`);
        return NextResponse.json(
            { error: `Failed to sync static GTFS data: ${error}` },
            { status: 500 }
        );
    }
}
