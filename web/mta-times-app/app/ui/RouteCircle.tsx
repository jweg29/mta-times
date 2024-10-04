import { Route } from "lib/definitions";
import { RouteCircleSize } from "modelHelpers";
import React from "react";

const RouteCircle: React.FC<{ size: RouteCircleSize, route: Route }> = ({ size, route }) => {
    if (route != null && route != undefined) {
        let widthHeight: string;
        let fontSize: string;
        switch (size) {
            case RouteCircleSize.small:
                widthHeight = '20px';
                fontSize: '4px';
                break;
            case RouteCircleSize.large:
                widthHeight = '50px';
                fontSize: '24px';
                break;
        }

        const circleStyle = {
            backgroundColor: `${route.gtfsRoute.route_color}`,
            color: '#fff', // Text color (white to contrast with the background)
            width: widthHeight,
            height: widthHeight,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: fontSize,
            fontWeight: 'bold',
        };

        return (
            <div style={circleStyle}>
                {route.gtfsRoute.route_short_name}
            </div>
        );
    } else {
        return (<></>)
    }
};

export default RouteCircle;