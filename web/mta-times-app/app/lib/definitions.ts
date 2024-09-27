export interface Stop {
  stop_id: string;
  stop_name: string;
  stop_lat: string;
  stop_lon: string;
  location_type: string;
  parent_station: string;
  [key: string]: string; // to handle any other fields
}

export interface StopTime {
  trip_id: string;
  stop_id: string;
  arrival_time: string;
  departure_time: string;
  stop_sequence: string;
  [key: string]: string | number;
}

export interface Trip {
  route_id: string;
  trip_id: string;
  service_id: string;
  trip_headsign: string;
  direction_id: string;
  shape_id: string;
  [key: string]: string;
}

export interface Departure {
  trip_id: string;
  route_id?: string;
  departure_time: Date;
  isRealtime: boolean;
}

/*export interface TripUpdate {
  trip: Trip;
  [key: string]: string;
}*/