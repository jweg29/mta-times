import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchAllStops } from '../../lib/gtfs';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const stops = fetchAllStops();
    res.status(200).json(stops);
  } catch (error) {
    console.error('Error fetching GTFS stops:', error);
    res.status(500).json({ error: 'Failed to fetch GTFS stops' });
  }
}