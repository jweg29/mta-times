import path from 'path';
import { GTFSRoute, GTFSStop, GTFSTrip, LiveFeedUrl, Route, Stop, StopTime } from './definitions';
import { parseCSV } from './utils';

export const fetchAllStops = async (): Promise<Stop[]> => {
  const stopsPath = path.join(process.cwd(), 'app', 'lib', 'staticGTFS', 'stops.txt');
  const parsedStops: GTFSStop[] = parseCSV(stopsPath);

  // Filter for only parent stops.
  const gtfsStops = parsedStops.filter(stop =>
    // We only want to display parent stops to prevent duplicates.
    stop.parent_station === '' &&
    stop.location_type === '1'
  );

  const trips = await fetchAllTrips();
  const tripMap: Map<string, GTFSTrip> = new Map();
  trips.forEach(trip => {
    tripMap.set(trip.trip_id, trip);
  });

  const routes = await fetchAllRoutes()
  const routeMap: Map<string, Route> = new Map();
  routes.forEach(route => {
    routeMap.set(route.gtfsRoute.route_id, route);
  });

  const stops = gtfsStops.map(gtfsStop => {
    const stop: Stop = {
      gtfsStop: gtfsStop,
      routes: []
    }
    return stop;
  })

  const allStopTimes = await fetchAllStopTimes();

  // The stops Ids for stop times are for child stops. They have an N or S appended to the end of the Id. We only care about the parent station id so we strip the last character off of these ids.
  allStopTimes.forEach(stopTime => {
    stopTime.stop_id = stopTime.stop_id.slice(0, -1);
  })

  const stopTimesMap: Map<string, StopTime[]> = new Map();
  allStopTimes.forEach(stopTime => {
    const stopTimes = stopTimesMap.get(stopTime.stop_id);
    if (stopTimes) {
      stopTimes.push(stopTime);
    } else {
      stopTimesMap.set(stopTime.stop_id, [stopTime]);
    }
  });

  for (const stop of stops) {
    const routesForStop = new Set<Route>();
    const stopTimes = stopTimesMap.get(stop.gtfsStop.stop_id);

    if (stopTimes == null || stopTimes.length == 0) {
      console.log(`No stop times found for stop: ${stop.gtfsStop.stop_id}`);
      continue;
    }

    for (const stopTime of stopTimes) {
      // get the trip from the stop time.
      const trip = tripMap.get(stopTime.trip_id);
      if (trip) {
        // get the route from the trip.
        const route = routeMap.get(trip.route_id);
        if (route) {
          routesForStop.add(route);
        } else {
          console.log('No route found for trip: ', trip);
        }
      } else {
        console.log('No trip found for stop time: ', stopTime);
      }
    }

    stop.routes = Array.from(routesForStop);
  };

  return stops;
};

export const fetchRouteById = async (routeId: string): Promise<Route> => {
  const routes = await fetchAllRoutes();
  const filteredRoutes = routes.filter(route => route.gtfsRoute.route_id === routeId);
  if (filteredRoutes.length > 0) {
    return filteredRoutes[0];
  } else {
    return null;
  }
}

export const fetchAllRoutes = async (): Promise<Route[]> => {
  const routesPath = path.join(process.cwd(), 'app', 'lib', 'staticGTFS', 'routes.txt');
  const gtfsRoutes: GTFSRoute[] = parseCSV(routesPath);

  // fix color by prepending # char.
  gtfsRoutes.forEach(route => {
    route.route_color = `#${route.route_color}`;
  });

  const routes = gtfsRoutes.map(gtfsRoute => {
    let liveFeeUrl: LiveFeedUrl;
    switch (gtfsRoute.route_id) {
      case 'A':
        liveFeeUrl = LiveFeedUrl.ACE;
        break;
      case 'C':
        liveFeeUrl = LiveFeedUrl.ACE;
        break;
      case 'E':
        liveFeeUrl = LiveFeedUrl.ACE;
        break;
      case 'B':
        liveFeeUrl = LiveFeedUrl.BDFM;
        break;
      case 'D':
        liveFeeUrl = LiveFeedUrl.BDFM;
        break;
      case 'F':
        liveFeeUrl = LiveFeedUrl.BDFM;
        break;
      case 'M':
        liveFeeUrl = LiveFeedUrl.BDFM;
        break;
      case 'G':
        liveFeeUrl = LiveFeedUrl.G;
        break;
      case 'J':
        liveFeeUrl = LiveFeedUrl.JZ;
        break;
      case 'Z':
        liveFeeUrl = LiveFeedUrl.JZ;
        break;
      case 'N':
        liveFeeUrl = LiveFeedUrl.NQRW;
        break;
      case 'Q':
        liveFeeUrl = LiveFeedUrl.NQRW;
        break;
      case 'R':
        liveFeeUrl = LiveFeedUrl.NQRW;
        break;
      case 'W':
        liveFeeUrl = LiveFeedUrl.NQRW;
        break;
      case 'L':
        liveFeeUrl = LiveFeedUrl.L;
        break;
      case '1':
        liveFeeUrl = LiveFeedUrl.OneTwoThreeFourFiveSixSeven;
        break;
      case '2':
        liveFeeUrl = LiveFeedUrl.OneTwoThreeFourFiveSixSeven;
        break;
      case '3':
        liveFeeUrl = LiveFeedUrl.OneTwoThreeFourFiveSixSeven;
        break;
      case '4':
        liveFeeUrl = LiveFeedUrl.OneTwoThreeFourFiveSixSeven;
        break;
      case '5':
        liveFeeUrl = LiveFeedUrl.OneTwoThreeFourFiveSixSeven;
        break;
      case '6':
        liveFeeUrl = LiveFeedUrl.OneTwoThreeFourFiveSixSeven;
        break;
      case '7':
        liveFeeUrl = LiveFeedUrl.OneTwoThreeFourFiveSixSeven;
        break;
      case 'SI':
        liveFeeUrl = LiveFeedUrl.SIR;
        break;
      case 'GS':
        // shuttle ??
        liveFeeUrl = LiveFeedUrl.ACE;
        break;
      case 'H':
        // shuttle ??
        liveFeeUrl = LiveFeedUrl.ACE;
        break;
      case 'FS':
        // shuttle ??
        liveFeeUrl = LiveFeedUrl.ACE;
        break;
      case 'FX':
        liveFeeUrl = LiveFeedUrl.BDFM;
        break;
      case '5X':
        liveFeeUrl = LiveFeedUrl.OneTwoThreeFourFiveSixSeven;
        break;
      case '6X':
        liveFeeUrl = LiveFeedUrl.OneTwoThreeFourFiveSixSeven;
        break;
      case '7X':
        liveFeeUrl = LiveFeedUrl.OneTwoThreeFourFiveSixSeven;
        break;
    }

    const route: Route = {
      gtfsRoute: gtfsRoute,
      liveFeedUrl: liveFeeUrl
    }
    return route;
  })

  return routes;
};

export const fetchAllStopTimes = async (): Promise<StopTime[]> => {
  const stopTimesPath = path.join(process.cwd(), 'app', 'lib', 'staticGTFS', 'stop_times.txt');
  const stopTimes: StopTime[] = parseCSV(stopTimesPath);
  return stopTimes;
};

/**
 * Retrieves departure times from the static stop_times.txt filtered by the given stopId.
 * @param stopId 
 * @returns an array of StopTime objects.
 */
export const getStopTimesByStopId = async (stopId: string): Promise<StopTime[]> => {
  const stopTimes = await fetchAllStopTimes();
  return stopTimes.filter(stopTime => stopTime.stop_id.startsWith(stopId));
};

export const fetchAllTrips = async (): Promise<GTFSTrip[]> => {
  const tripsPath = path.join(process.cwd(), 'app', 'lib', 'staticGTFS', 'trips.txt');
  const gtfsTrips: GTFSTrip[] = parseCSV(tripsPath);
  return gtfsTrips;
};

/**
 * Retrieves trips from the static trips.txt filtered by the given tripIds.
 * @param tripIds 
 * @returns an array of Trip objects.
 */
export const getTripsByTripIds = async (tripIds: string[]): Promise<GTFSTrip[]> => {
  const trips = await fetchAllTrips();
  const filteredTrips: GTFSTrip[] = [];

  trips.forEach(trip => {
    tripIds.forEach(tripId => {
      if (trip.trip_id.includes(tripId)) {
        filteredTrips.push(trip);
      }
    })
  });

  return filteredTrips;
};

export const getStopById = async (stopId: string): Promise<Stop | undefined> => {
  const stops = await fetchAllStops();
  return stops.find(stop => stop.gtfsStop.stop_id === stopId);
};