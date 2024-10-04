import path from 'path';
import { GTFSRoute, LiveFeedUrl, Route } from '../definitions';
import { parseCSV } from '../utils';

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
