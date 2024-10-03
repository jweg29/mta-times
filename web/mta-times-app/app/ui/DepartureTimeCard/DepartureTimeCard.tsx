'use client';

import { Card, Space, Text } from '@mantine/core';
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

    return (
        // Check if departure time is a valid date
        departure?.departure_time != undefined && departure?.departure_time != null
            ?
            <>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Text fw={700}>{departure.trip.routeId} - {departure.trip.gtfsTrip.trip_headsign}</Text>
                    <Text size="md">{departure.departureDisplay} ({formattedTime})</Text>
                </Card>
                <Space h="md" />
            </>
            :
            (<p>"Invalid departure date"</p>)
    );
}
