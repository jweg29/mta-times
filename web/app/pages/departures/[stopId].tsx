// pages/departures/[stopId].tsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { format } from 'date-fns';

interface Departure {
  trip_id: string;
  route_id?: string;
  departure_time: Date;
  isRealtime: boolean;
}

interface Stop {
  stop_id: string;
  stop_name: string;
}

interface DeparturesData {
  stop: Stop;
  departures: Departure[];
}

export default function Departures() {
  const router = useRouter();
  const { stopId } = router.query;
  const [departuresData, setDeparturesData] = useState<DeparturesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!stopId) return;

    const fetchDepartures = async () => {
      try {
        const response = await fetch(`/api/gtfs/departures?stopId=${stopId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch departures');
        }
        const data: DeparturesData = await response.json();
        setDeparturesData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartures();
  }, [stopId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  if (!departuresData /*|| departuresData.departures.length === 0*/) return <p>No upcoming departures available</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Departures for {departuresData.stop.stop_name}</h1>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {departuresData.departures.map((departure) => (
          <li key={departure.trip_id} style={{ marginBottom: '10px' }}>
            <strong>Route:</strong> {departure.route_id || 'Unknown'} <br />
            <p>{ format(departure.departure_time, 'hh:mm:ss aa') }</p>
            <p>{departure.isRealtime ? '(Real-time)' : '(Scheduled)'}</p>
            {/* <strong>Departure Time:</strong> {(departure.departure_time && departure.departure_time.getTime && !isNaN(departure.departure_time.getTime())) ? departure.departure_time.toLocaleTimeString() : 'Invalid time'} {departure.isRealtime ? '(Real-time)' : '(Scheduled)'} */}
            <br></br>
          </li>
        ))}
      </ul>
    </div>
  );
}