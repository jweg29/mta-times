// pages/api/realtime.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
const GtfsRealtimeBindings = require('gtfs-realtime-bindings').transit_realtime;
const { FeedMessage, FeedHeader, FeedEntity, VehiclePosition } = GtfsRealtimeBindings;

export interface TripUpdate {
  trip: Trip;
  [key: string]: string;
}

export const getRealtimeTripUpdates = async () => {
  const gtfsRealtimeUrl = 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-l';
  /*
  https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace
  https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-bdfm
  https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-g
  https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-jz
  https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-nqrw
  https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-l
  https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs
  https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-si
  */
  const response = await fetch(gtfsRealtimeUrl);
  const arrayBuffer = await response.arrayBuffer();
  const feed = GtfsRealtimeBindings.FeedMessage.decode(new Uint8Array(arrayBuffer));
  return feed.entity.filter(entity => entity.tripUpdate);
};

