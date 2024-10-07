import { Route } from "@prisma/client";

export interface GTFSStop {
  stop_id: string;
  stop_name: string;
  stop_lat: string;
  stop_lon: string;
  location_type: string;
  parent_station: string;
}

/**
 * Meta class that contains all the stop data parsed from static data files.
 */
export interface StopData {
  gtfsStop: GTFSStop;
  routes: RouteData[];
  northDirectionLabel: string;
  southDirectionLabel: string;
  ada: string;
  adaNotes: string;
}

export interface CSVStation {
  stopId: string;
  division: string;
  line: string;
  stopName: string;
  northDirectionLabel: string;
  southDirectionLabel: string;
  ada: string;
  adaNotes: string;
}

// Must match the GTFS schema defined in trips.txt.
export interface GTFSTrip {
  route_id: string;
  trip_id: string;
  service_id: string;
  trip_headsign: string;
  direction_id: string;
  shape_id: string;
}

export interface Trip {
  tripId: string;
  startDate: string;
  scheduleRelationship: string;
  routeId: string;
  route?: Route;
  directionId: number;
  gtfsTrip: GTFSTrip
}

export interface StopTime {
  trip_id: string;
  trip?: Trip;
  stop_id: string;
  arrival_time: string;
  departure_time: string;
  stop_sequence: string;
}

export interface Departure {
  trip?: Trip;
  departure_time: string;
  departureDisplay: string;
  departureDisplayShort: string;
  isRealtime: boolean;
}

export interface StopTimeUpdate {
  stopSequence: string;
  stopId: string;
  scheduleRelationship: string;
  arrival: [string: any];
  departure: [string: any];
}

export interface TripUpdate {
  trip: Trip;
  stopTimeUpdate: StopTimeUpdate[];
}

export interface RealtimeTrip {
  id: string;
  isDeleted: boolean;
  tripUpdate: TripUpdate;
  timestamp: string;
}

export interface GTFSRoute {
  agency_id: string;
  route_id: string;
  route_short_name: string;
  route_long_name: string;
  route_type: string;
  route_desc: string;
  route_url: string;
  route_color: string;
  route_text_color: string;
}

/**
 * Meta class that contains all the stop data parsed from static data files.
 */
export interface RouteData {
  gtfsRoute: GTFSRoute;
  liveFeedUrl: LiveFeedUrl;
}

export enum LiveFeedUrl {
  ACE = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace",
  BDFM = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-bdfm",
  G = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-g",
  JZ = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-jz",
  NQRW = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-nqrw",
  L = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-l",
  OneTwoThreeFourFiveSixSeven = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs",
  SIR = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-si",
}