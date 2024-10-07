import { Route, Stop } from "@prisma/client";

export const stopRoutesDisplayString = (stop: (Stop & { routes: Route[] })) => {
    let routesDisplay = "";
    if (stop != null && stop.routes != null) {
        stop.routes.forEach(route => {
            routesDisplay += route.shortName + " ";
        })
    }
    return routesDisplay.trimEnd();
}

export enum RouteCircleSize {
    small,
    large,
}