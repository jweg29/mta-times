import { fetchAllStops } from "../lib/gtfs";
import { Stop } from "../lib/definitions";

export default async function UpcomingDepartures({
    stop
}: {
    stop: Stop
}) {
    // TODO: fetch departures for stop

    return (
        <>
            <h2>Upcoming Departures 🕰️</h2>
        </>
    );
}
