import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';
import { parseCSV } from './utils';
import { Stop } from './definitions';
import { StopTime } from './definitions';
import { Trip } from './definitions';

export const fetchAllStops = async (): Promise<Stop[]> => {
  const stopsPath = path.join(process.cwd(), 'app', 'lib', 'gtfs', 'stops.txt');

  const stops: Stop[] = parseCSV(stopsPath);
  return stops;
};

export const getStopTimesByStopId = (stopId: string): StopTime[] => {
  //console.log(`getStopTimesByStopId ${stopId}`);
  const stopTimesPath = path.join(process.cwd(), 'public', 'gtfs', 'stop_times.txt');
  const stopTimes: StopTime[] = parseCSV(stopTimesPath);
  return stopTimes.filter(stopTime => stopTime.stop_id === stopId);
};

export const getTripsByTripIds = (tripIds: string[]): Trip[] => {
  //console.log(`getTripsByTripIds ${tripIds}`);
  const tripsPath = path.join(process.cwd(), 'public', 'gtfs', 'trips.txt');
  const trips: Trip[] = parseCSV(tripsPath);
  return trips.filter(trip => tripIds.includes(trip.trip_id));
};

export const getStopById = (stopId: string): Stop | undefined => {
  //console.log(`getStopById ${stopId}`);
  const stopsPath = path.join(process.cwd(), 'public', 'gtfs', 'stops.txt');
  const stops: Stop[] = parseCSV(stopsPath);
  return stops.find(stop => stop.stop_id === stopId);
};