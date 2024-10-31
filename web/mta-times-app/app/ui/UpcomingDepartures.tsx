'use client'

import { Card, Grid, Space, Text } from '@mantine/core';
import { Departure } from "lib/definitions";
import React, { useEffect, useState } from "react";
import { useStopSelection } from "../StopSelectionContext";
import DepartureTimeCard from './DepartureTimeCard/DepartureTimeCard';

const UpcomingDepartures: React.FC = () => {
    const [departures, setDepartures] = useState<Departure[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { selectedStop } = useStopSelection(); // Get selectedStop from context

    useEffect(() => {
        const fetchData = async () => {
            if (selectedStop == null) {
                console.log(`No stop selected`);
                return;
            }

            const departuresResponse = await fetch(`api/departures?stopId=${selectedStop.gtfsStopId}`)

            if (!departuresResponse.ok) {
                console.log(`Failed to fetch departures`);
                //throw new Error('Failed to fetch departures');
            }

            // Parse the JSON response
            const data = await departuresResponse.json();

            // Ensure that the data is an array
            if (!Array.isArray(data)) {
                throw new Error('Expected an array of departures');
            }
            setDepartures(data as Departure[]);
        };

        fetchData();

        // refresh every 10 seconds
        const intervalId = setInterval(fetchData, 10000); // 60000 milliseconds = 1 minute
        return () => clearInterval(intervalId); // Cleanup on unmount

    }, [selectedStop]); // Set the dependency array to selectedStop so it will update when the value changes i think?

    if (selectedStop == null) {
        return (<></>)
    } else if (departures == null) {
        return (
            <>
                <h2>Upcoming Departures 🕰️</h2>
                <p>Loading departures for {selectedStop.name}...⏳</p>
            </>
        )
    }

    const northBoundDepartures = departures.filter(departure => departure.directionId == "N")
    const southBoundDepartures = departures.filter(departure => departure.directionId == "S")

    return (
        <>
            <Grid>
                <Grid.Col span={6}>
                    <Card padding="0">
                        <Text fw={700} > {selectedStop.northDirectionLabel} </Text>
                        <Space h="sm" />
                        {northBoundDepartures.map((departure) => (
                            <DepartureTimeCard departure={departure} />
                        ))}
                    </Card>
                </Grid.Col>

                <Grid.Col span={6}>
                    <Card padding="0">
                        <Text fw={700}> {selectedStop.southDirectionLabel} </Text>
                        <Space h="sm" />
                        {southBoundDepartures.map((departure) => (
                            <DepartureTimeCard departure={departure} />
                        ))}
                    </Card>
                </Grid.Col>
            </Grid >
        </>
    )
}

export default UpcomingDepartures;