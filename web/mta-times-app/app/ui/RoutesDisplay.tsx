import { Route } from "@prisma/client";
import { RouteCircleSize } from "modelHelpers";
import RouteCircle from "./RouteCircle";

const RoutesDisplay: React.FC<{ routes: Route[] }> = ({ routes }) => {
    if (routes == null || routes == undefined) {
        return (<div></div>)
    }

    const standardRoutes = routes.filter(route => route.shortName.length == 1);

    return (
        <div style={{ display: 'flex', gap: '10px' }}>
            {standardRoutes.map((route, index) => (
                <RouteCircle route={route} size={RouteCircleSize.large}></RouteCircle>
            ))}
        </div>
    );
};

export default RoutesDisplay;