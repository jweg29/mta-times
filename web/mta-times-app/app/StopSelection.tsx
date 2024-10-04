import { fetchAllStops } from "lib/gtfsHelpers/stops";
import { Stop } from "./lib/definitions";
import InteractiveStopSelection from './ui/InteractiveStopSelection';

type StopSelectionProps = {
    selectedStop: Stop | null;
    onSelectStop: (stop: Stop | null) => void;
};

export default async function StopSelection() {
    const stops = await fetchAllStops();
    return (<InteractiveStopSelection stops={stops} />);
}
