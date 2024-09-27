import type { NextApiRequest, NextApiResponse } from 'next';
import { Stop } from '../../lib/definitions';
import { fetchAllStops } from '../../lib/gtfs';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<Stop[] | { error: String }>) {
  try {
    const stops = await fetchAllStops();
    response.status(200).json(stops);
  } catch (error) {
    console.error('Error fetching GTFS stops:', error);
    response.status(500).json({ error: 'Failed to fetch GTFS stops' });
  }
}