export interface GTFSStop {
  stop_id: string;
  stop_name: string;
  stop_lat: string;
  stop_lon: string;
  location_type: string;
  parent_station: string;
}

export interface Stop {
  gtfsStop: GTFSStop;
  routes: Route[];
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

export interface Route {
  gtfsRoute: GTFSRoute;
  //routeType: RouteType;
  liveFeedUrl: LiveFeedUrl;
}

/*export enum RouteType {
  A = "A",
  C = "C",
  E = "E",
  B = "B",
  D = "D",
  F = "F",
  M = "M",
  G = "G",
  J = "J",
  Z = "Z",
  N = "N",
  Q = "Q",
  R = "R",
  W = "W",
  L = "L",
  One = "One",
  Two = "Two",
  Three = "Three",
  Four = "Four",
  Five = "Five",
  Six = "Six",
  Seven = "Seven",
}*/

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