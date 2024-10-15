import fetch from 'node-fetch';
import { RealtimeTrip } from './definitions';
const GtfsRealtimeBindings = require('gtfs-realtime-bindings').transit_realtime;
const { FeedMessage, FeedHeader, FeedEntity, Alert, Vehicle, VehiclePosition } = GtfsRealtimeBindings;

export const getRealtimeTripUpdates = async (liveFeedURL: string): Promise<RealtimeTrip[]> => {
  console.log(`getRealtimeTripUpdates for ${liveFeedURL}`);
  try {
    const gtfsRealtimeUrl = liveFeedURL;
    const response = await fetch(gtfsRealtimeUrl);
    const arrayBuffer = await response.arrayBuffer();
    const feed = GtfsRealtimeBindings.FeedMessage.decode(new Uint8Array(arrayBuffer));
    return feed.entity.filter(entity => entity.tripUpdate);
  } catch (error) {
    console.error(`Error fetching realtime updates for ${liveFeedURL}:`, error);
    return [];
  }
};

