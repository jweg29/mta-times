// pages/api/gtfs-realtime.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
const GtfsRealtimeBindings = require('gtfs-realtime-bindings').transit_realtime;
const { FeedMessage, FeedHeader, FeedEntity, VehiclePosition } = GtfsRealtimeBindings;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const gtfsRealtimeUrl = 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-l'; // Replace with the actual URL of the GTFS-realtime feed

  try {
    // Fetch the GTFS-realtime feed
    const response = await fetch(gtfsRealtimeUrl);
    const arrayBuffer = await response.arrayBuffer();

    // Parse the GTFS-realtime feed using gtfs-realtime-bindings
    const feed = GtfsRealtimeBindings.FeedMessage.decode(new Uint8Array(arrayBuffer));
    // Return the parsed data as JSON
    res.status(200).json(feed);
  } catch (error) {
    console.error('Error fetching or parsing GTFS-realtime feed:', error);
    res.status(500).json({ error: 'Failed to fetch GTFS-realtime data' });
  }
}