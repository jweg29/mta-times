'use client';

import { Card, Space, Text } from '@mantine/core';
import { RouteCircleSize } from 'modelHelpers';
import RouteCircle from 'ui/RouteCircle';
import { Departure } from "../../lib/definitions";

export default function DepartureTimeCard({ departure }: { departure: Departure }) {
    if (departure == undefined) {
        return <> </>;
    }

    const departureDate = new Date(departure.departure_time)
    const formattedTime = departureDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,  // 12-hour format with AM/PM
    });

    const circleStyle = {
        width: '10px',
        height: '10px',
    };

    return (
        // Check if departure time is a valid date
        departure?.departure_time != undefined && departure?.departure_time != null
            ?
            <>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', }}>
                        {/* Left-aligned and vertically centered icon */}
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <RouteCircle route={departure.trip.route} size={RouteCircleSize.small}></RouteCircle>
                        </div>

                        {/* Right-aligned text */}
                        <div style={{ textAlign: 'left', }}>
                            <Text fw={700}>{departure.trip?.headsign}</Text>
                            <Text size="md">{departure.departureDisplay}</Text>
                        </div>

                    </div>
                </Card >
                <Space h="md" />
            </>
            :
            (<p>"Invalid departure date"</p>)
    );
}
