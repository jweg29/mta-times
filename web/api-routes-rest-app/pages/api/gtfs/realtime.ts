// pages/api/realtime.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllStops } from '../../../utils/gtfs';
import { getRealtimeTripUpdates } from '../../../utils/realtime';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const realtimeTrips = await getRealtimeTripUpdates();
    res.status(200).json(realtimeTrips);
  } catch (error) {
    console.error('Error fetching GTFS Realtime updates:', error);
    res.status(500).json({ error: 'Failed to fetch GTFS live feed' });
  }
}