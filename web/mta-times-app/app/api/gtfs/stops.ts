import { Stop } from '@prisma/client';
import { fetchStops } from 'lib/gtfsHelpers/stops';
import type { NextApiRequest, NextApiResponse } from 'next';
export const dynamic = 'force-dynamic'; // defaults to auto

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<Stop[] | { error: String }>) {
  try {
    const stops = await fetchStops();
    response.status(200).json(stops);
  } catch (error) {
    console.error('Error fetching GTFS stops:', error);
    response.status(500).json({ error: 'Failed to fetch GTFS stops' });
  }
}