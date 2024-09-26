import { Stop } from "./lib/definitions";
import { fetchAllStops } from "./lib/gtfs";
import InteractiveStopSelection from './ui/InteractiveStopSelection';

type StopSelectionProps = {
    selectedStop: Stop | null;
    onSelectStop: (stop: Stop | null) => void;
};

export default async function StopSelection() {
    const stops = (await fetchAllStops()).filter((stop) => (
        // We only want to display parent stops to prevent duplicates.
        stop.parent_station === '' &&
        stop.location_type === '1'
    ));

    return (<InteractiveStopSelection stops={stops} />);
}
