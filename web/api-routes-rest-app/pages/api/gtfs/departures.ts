// pages/api/departures.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { getStopTimesByStopId, getTripsByTripIds, getStopById } from '../../../utils/gtfs';
import { getRealtimeTripUpdates } from '../../../utils/realtime';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { stopId } = req.query;

  if (typeof stopId !== 'string') {
    return res.status(400).json({ error: 'Invalid stop ID' });
  }

  const stop = getStopById(stopId);
  if (!stop) {
    return res.status(404).json({ error: 'Stop not found' });
  }

  const staticStopTimes = getStopTimesByStopId(stopId);
  const tripIds = staticStopTimes.map(stopTime => stopTime.trip_id);
  const trips = getTripsByTripIds(tripIds);

  const realtimeUpdates = await getRealtimeTripUpdates();
  const realtimeTripIds = realtimeUpdates.map(update => update.tripUpdate?.trip?.tripId);
  console.log(`realtimeTripIds ${realtimeTripIds}`)

  const now = new Date();

  const departures = staticStopTimes
    .map(stopTime => {
      const isRealtime = realtimeTripIds.includes(stopTime.trip_id);
      const realtimeUpdate = realtimeUpdates.find(update => update.tripUpdate?.trip?.tripId === stopTime.trip_id);

      const departureTime = isRealtime
        ? new Date(realtimeUpdate!.tripUpdate!.stopTimeUpdate!.find(update => update.stopId === stopId)?.departure?.time! * 1000)
        : new Date(`1970-01-01T${stopTime.departure_time}Z`);

      return {
        trip_id: stopTime.trip_id,
        route_id: trips.find(trip => trip.trip_id === stopTime.trip_id)?.route_id,
        departure_time: departureTime,
        isRealtime,
      };
    })
    .filter(departure => departure.departure_time && !isNaN(departure.departure_time.getTime())) // Filter out invalid or past times
    //.filter(departure => departure.departure_time > now) // Only keep future times
    .sort((a, b) => a.departure_time.getTime() - b.departure_time.getTime()); // Sort by time

  res.status(200).json({ stop, departures });
}