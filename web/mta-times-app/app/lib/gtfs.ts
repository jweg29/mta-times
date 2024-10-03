import path from 'path';
import { GTFSTrip, Stop, StopTime } from './definitions';
import { parseCSV } from './utils';

export const fetchAllStops = async (): Promise<Stop[]> => {
  const stopsPath = path.join(process.cwd(), 'app', 'lib', 'gtfs', 'stops.txt');
  const stops: Stop[] = parseCSV(stopsPath);
  //console.log(`stops: ${stops}`);
  return stops;
};

/**
 * Retrieves departure times from the static stop_times.txt filtered by the given stopId.
 * @param stopId 
 * @returns an array of StopTime objects.
 */
export const getStopTimesByStopId = (stopId: string): StopTime[] => {
  //console.log(`getStopTimesByStopId ${stopId}`);
  const stopTimesPath = path.join(process.cwd(), 'app', 'lib', 'gtfs', 'stop_times.txt');
  const stopTimes: StopTime[] = parseCSV(stopTimesPath);
  // The stop ID for stop times also contains the direction. For example Lorimer (L10) could be L10N or L10S.
  return stopTimes.filter(stopTime => stopTime.stop_id.startsWith(stopId));
};

/**
 * Retrieves trips from the static trips.txt filtered by the given tripIds.
 * @param tripIds 
 * @returns an array of Trip objects.
 */
export const getTripsByTripIds = (tripIds: string[]): GTFSTrip[] => {
  //console.log(`getTripsByTripIds ${tripIds}`);
  const tripsPath = path.join(process.cwd(), 'app', 'lib', 'gtfs', 'trips.txt');
  const trips: GTFSTrip[] = parseCSV(tripsPath);

  const filteredTrips: GTFSTrip[] = [];

  trips.forEach(trip => {
    tripIds.forEach(tripId => {
      if (trip.trip_id.includes(tripId)) {
        // we want to include this trip
        //return true;
        filteredTrips.push(trip);
      }
    })
  });

  return filteredTrips;
};

export const getStopById = (stopId: string): Stop | undefined => {
  //console.log(`getStopById ${stopId}`);
  const stopsPath = path.join(process.cwd(), 'app', 'lib', 'gtfs', 'stops.txt');
  const stops: Stop[] = parseCSV(stopsPath);
  return stops.find(stop => stop.stop_id === stopId);
};