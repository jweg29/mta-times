import { Stop } from "lib/definitions";

export const stopRoutesDisplayString = (stop: Stop) => {
    let routesDisplay = "";
    if (stop != null && stop.routes != null) {
        stop.routes.forEach(route => {
            routesDisplay += route.gtfsRoute.route_short_name + " ";
        })
    }
    return routesDisplay.trimEnd();
}

export enum RouteCircleSize {
    small,
    large,
}