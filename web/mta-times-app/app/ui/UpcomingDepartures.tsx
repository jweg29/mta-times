'use client'

import { Departure } from "lib/definitions";
import React, { useEffect, useState } from "react";
import { useStopSelection } from "../StopSelectionContext";
import DepartureTimeCard from "./DepartureTimeCard/DepartureTimeCard";

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

        // refresh every 15 seconds
        const intervalId = setInterval(fetchData, 10000); // 60000 milliseconds = 1 minute
        return () => clearInterval(intervalId); // Cleanup on unmount

    }, [selectedStop]); // Set the dependency array to selectedStop so it will update when the value changes i think?

    if (selectedStop == null) {
        return <h2>Upcoming Departures 🕰️</h2>
    } else if (departures == null) {
        return (
            <>
                <h2>Upcoming Departures 🕰️</h2>
                <p>Loading departures for {selectedStop.name}...⏳</p>
            </>
        )
    } else if (departures.length == 0) {
        return (
            <>
                <h2>Upcoming Departures 🕰️</h2>
                <p>No departures found for {selectedStop.name} 😢</p>
            </>
        )
    } else {
        return (
            <>
                <h2>Upcoming Departures 🕰️</h2>
                {
                    departures.map((departure) => (
                        <DepartureTimeCard departure={departure} />
                    ))
                }
            </>
        )
    }
}

export default UpcomingDepartures;