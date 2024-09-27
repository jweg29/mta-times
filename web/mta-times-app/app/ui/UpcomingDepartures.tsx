'use client'

import { Departure } from "lib/definitions";
import { useEffect, useState } from 'react';
import { useStopSelection } from "../StopSelectionContext";

const UpcomingDepartures: React.FC = () => {
    //const router = useRouter();
    //const { stopId } = router.query;
    const [departures, setDepartures] = useState<Departure[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { selectedStop } = useStopSelection(); // Get selectedStop from context

    useEffect(() => {
        const fetchData = async () => {
            // TODO: fetch departures for stop
            console.log(`UpcomingDepartures useEffect called`)

            const departuresResponse = await fetch(`api/departures?stopId=${selectedStop.stop_id}`)

            if (!departuresResponse.ok) {
                console.log(`Failed to fetch departures`);
                throw new Error('Failed to fetch departures');
            }

            const departures: Departure[] = departuresResponse.json();
            console.log(departures);
            setDepartures(departures);
        };

        fetchData();
    }, [selectedStop]); // Empty dependency array means this effect runs once when the component mounts

    //const stopTimes = await getStopTimesByStopId(selectedStop.stop_id);
    //console.log(stopTimes);

    if (selectedStop == null) {
        return <h2>Upcoming Departures 🕰️</h2>
    } else if (departures == null || departures.length == 0) {
        return (
            <>
                <h2>Upcoming Departures 🕰️</h2>
                <p>Unable to fetch departures for {selectedStop.stop_name}</p>
            </>
        )
    } else {
        return (
            <>
                <h2>Upcoming Departures 🕰️</h2>
                {
                    departures.map((departure) => (
                        <p>{departure.trip_id}</p>
                    ))
                }
            </>
        )
    }
}

export default UpcomingDepartures;