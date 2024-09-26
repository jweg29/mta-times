// pages/api/departures.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { getStopTimesByStopId, getTripsByTripIds, getStopById } from '../../lib/gtfs';
//import { getRealtimeTripUpdates, TripUpdate } from '../../lib/realtime';
import { getRealtimeTripUpdates } from '../../lib/realtime';

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
  //console.log(`realtimeTripIds:\n ${realtimeTripIds}`)

  /*
  - Go through each trip update
  - Find the update with my stop
  - Store each time
  - Sort by upcoming
  - Seperate by direction
  */

  // 

  //const stopTimeUpdates = realtimeUpdates.map(update => update.tripUpdate?.trip?.stopTimeUpdate);

  var dates: string[] = [];

  /*const stopTimeUpdates = realtimeUpdates
    .map(update => update.tripUpdate?.stopTimeUpdate);

  res.status(200).json({stopTimeUpdates});*/

  // go through each trip update
  /*var stopTimeUpdates: [Object];

  realtimeUpdates.forEach( (realTimeUpdate) => {
    const tripUpdate = realTimeUpdate.tripUpdate;
    var stopTimeUpdates = tripUpdate.stopTimeUpdate;
    //console.log(stopTimeUpdates)

    //stopTimeUpdates = stopTimeUpdates.filter( stopTimeUpdate => stopTimeUpdate.stopId === stopId )
    //console.log(stopTimeUpdates)
    //stopTimeUpdates.map( stopTimeUpdate => stopTimeUpdate.departure.time)
    const stopUpdates = stopTimeUpdates
      .filter( stopTimeUpdate => stopTimeUpdate.stopId === stopId )
      //.flatMap( stopTimeUpdate => new Date(stopTimeUpdate.departure.time))

    if(stopUpdates && stopUpdates.length > 0) {
      console.log(stopUpdates)
      stopTimeUpdates.push;
    }/
});*/


  //const stopTimeUpdates: [String: Object] = realtimeUpdates[0].tripUpdate.stopTimeUpdate;
  // res.status(200).json({ stopTimeUpdates });

  //for (const tripUpdate in realtimeUpdates.tripUpdate){
  //  console.log(tripUpdate.stopId);
  //}

  /*realtimeUpdates.tripUpdate.forEach((tripUpdate: Object) => {
    // go through each stopTimeUpdate
    tripUpdate["stopTimeUpdate"].forEach((stopTimeUpdate: Object) => {
      // filter by stop ID
      // then look at the departure object and store time
      if (stopTimeUpdate["stopId"] === stopId) {
        dates.push(stopTimeUpdate["departure"]["time"])
      }
    });
  });*/


  //realtimeTripIds.forEach((realTimeTripId: string) => {
  //});

  //res.status(200).json({ dates });

  const departures = staticStopTimes
    .map(stopTime => {
      // stopTime.trip_id ex:                               BSP24GEN-L049-Weekday-00_106300_L..N01R,L01N
      // realtimeUpdates.update.tripUpdate.trip.tripId ex:  106300_L..N

      //const isRealtime = 
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
    .sort((a, b) => a.departure_time.getTime() - b.departure_time.getTime()); // Sort by time*/


  res.status(200).json({ stop, departures });
}