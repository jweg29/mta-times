import fetch from 'node-fetch';
import { LiveFeedUrl, RealtimeTrip } from './definitions';
const GtfsRealtimeBindings = require('gtfs-realtime-bindings').transit_realtime;
const { FeedMessage, FeedHeader, FeedEntity, Alert, Vehicle, VehiclePosition } = GtfsRealtimeBindings;

export const getRealtimeTripUpdates = async (feedType: LiveFeedUrl): Promise<RealtimeTrip[]> => {
  const gtfsRealtimeUrl = feedType;
  const response = await fetch(gtfsRealtimeUrl);
  const arrayBuffer = await response.arrayBuffer();
  const feed = GtfsRealtimeBindings.FeedMessage.decode(new Uint8Array(arrayBuffer));
  return feed.entity.filter(entity => entity.tripUpdate);
};

