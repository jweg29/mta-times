// // pages/departures/[stopId].tsx

// import { format } from 'date-fns';
// import { useRouter } from 'next/router';
// import { useEffect, useState } from 'react';

// interface DeparturesData {
//   stop: Stop;
//   departures: Departure[];
// }

// export default function Departures() {
//   const router = useRouter();
//   const { stopId } = router.query;
//   const [departuresData, setDeparturesData] = useState<DeparturesData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!stopId) return;

//     const fetchDepartures = async () => {
//       try {
//         const response = await fetch(`/api/gtfs/departures?stopId=${stopId}`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch departures');
//         }
//         const data: DeparturesData = await response.json();
//         setDeparturesData(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDepartures();
//   }, [stopId]);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error}</p>;

//   if (!departuresData) return <p>No upcoming departures available</p>;

//   return (
//     <div style={{ padding: '20px' }}>
//       <h1>Departures for {departuresData.stop.stop_name}</h1>
//       <ul style={{ listStyleType: 'none', padding: 0 }}>
//         {departuresData.departures.map((departure) => (
//           <li key={departure.trip_id} style={{ marginBottom: '10px' }}>
//             <strong>Route:</strong> {departure.route_id || 'Unknown'} <br />
//             <p>{format(departure.departure_time, 'hh:mm:ss aa')}</p>
//             <p>{departure.isRealtime ? '(Real-time)' : '(Scheduled)'}</p>
//             <br></br>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }