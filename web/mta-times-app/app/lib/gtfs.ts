import path from 'path';
import { Stop, StopTime, Trip } from './definitions';
import { parseCSV } from './utils';

export const fetchAllStops = async (): Promise<Stop[]> => {
  const stopsPath = path.join(process.cwd(), 'app', 'lib', 'gtfs', 'stops.txt');
  const stops: Stop[] = parseCSV(stopsPath);
  //console.log(`stops: ${stops}`);
  return stops;
};

export const getStopTimesByStopId = (stopId: string): StopTime[] => {
  //console.log(`getStopTimesByStopId ${stopId}`);
  const stopTimesPath = path.join(process.cwd(), 'app', 'lib', 'gtfs', 'stop_times.txt');
  const stopTimes: StopTime[] = parseCSV(stopTimesPath);
  return stopTimes.filter(stopTime => stopTime.stop_id === stopId);
};

export const getTripsByTripIds = (tripIds: string[]): Trip[] => {
  //console.log(`getTripsByTripIds ${tripIds}`);
  const tripsPath = path.join(process.cwd(), 'app', 'lib', 'gtfs', 'trips.txt');
  const trips: Trip[] = parseCSV(tripsPath);
  return trips.filter(trip => tripIds.includes(trip.trip_id));
};

export const getStopById = (stopId: string): Stop | undefined => {
  //console.log(`getStopById ${stopId}`);
  const stopsPath = path.join(process.cwd(), 'app', 'lib', 'gtfs', 'stops.txt');
  const stops: Stop[] = parseCSV(stopsPath);
  return stops.find(stop => stop.stop_id === stopId);
};