export interface Stop {
  stop_id: string;
  stop_name: string;
  stop_lat: string;
  stop_lon: string;
  location_type: string;
  parent_station: string;
  [key: string]: string;
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