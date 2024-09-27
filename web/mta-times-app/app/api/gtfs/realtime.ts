import { Stop } from 'lib/definitions';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getRealtimeTripUpdates } from '../../lib/realtime';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<Stop[] | { error: String }>) {
  try {
    const realtimeTrips = await getRealtimeTripUpdates();
    response.status(200).json(realtimeTrips);
  } catch (error) {
    console.error('Error fetching GTFS Realtime updates:', error);
    response.status(500).json({ error: 'Failed to fetch GTFS live feed' });
  }
}