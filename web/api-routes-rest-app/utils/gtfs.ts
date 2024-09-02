// utils/gtfs.ts

import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export const getAllStops = (): Stop[] => {
  console.log(`getAllStops`);
  const stopsPath = path.join(process.cwd(), 'public', 'gtfs', 'stop_times.txt');
  const stops: Stop[] = parseCSV(stopsPath);
  return stops;
};

export const getStopTimesByStopId = (stopId: string): StopTime[] => {
  console.log(`getStopTimesByStopId ${stopId}`);
  const stopTimesPath = path.join(process.cwd(), 'public', 'gtfs', 'stop_times.txt');
  const stopTimes: StopTime[] = parseCSV(stopTimesPath);
  return stopTimes.filter(stopTime => stopTime.stop_id === stopId);
};

export const getTripsByTripIds = (tripIds: string[]): Trip[] => {
  console.log(`getTripsByTripIds ${tripIds}`);
  const tripsPath = path.join(process.cwd(), 'public', 'gtfs', 'trips.txt');
  const trips: Trip[] = parseCSV(tripsPath);
  return trips.filter(trip => tripIds.includes(trip.trip_id));
};

export const getStopById = (stopId: string): Stop | undefined => {
  console.log(`getStopById ${stopId}`);
  const stopsPath = path.join(process.cwd(), 'public', 'gtfs', 'stops.txt');
  const stops: Stop[] = parseCSV(stopsPath);
  return stops.find(stop => stop.stop_id === stopId);
};

// Interfaces

interface Stop {
  stop_id: string;
  stop_name: string;
  stop_lat: string;
  stop_lon: string;
  location_type: string;
  parent_station: string;
  [key: string]: string; // to handle any other fields
}

interface StopTime {
  trip_id: string;
  stop_id: string;
  arrival_time: string;
  departure_time: string;
  stop_sequence: string;
  [key: string]: string | number;
}

interface Trip {
  route_id: string;
  trip_id: string;
  service_id: string;
  trip_headsign: string;
  direction_id: string;
  shape_id: string;
  [key: string]: string;
}

// Helpers

const parseCSV = (filePath: string) => {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });
};