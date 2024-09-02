// pages/api/stops.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllStops } from '../../../utils/gtfs';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const stops = getAllStops();
    res.status(200).json(stops);
  } catch (error) {
    console.error('Error fetching GTFS stops:', error);
    res.status(500).json({ error: 'Failed to fetch GTFS stops' });
  }
}