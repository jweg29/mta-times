import { Stop } from "@prisma/client";
import { fetchStops } from "lib/gtfsHelpers/stops";
import InteractiveStopSelection from './ui/InteractiveStopSelection';

type StopSelectionProps = {
    selectedStop: Stop | null;
    onSelectStop: (stop: Stop | null) => void;
};

export default async function StopSelection() {
    const stops = await fetchStops();
    return (<InteractiveStopSelection stops={stops} />);
}
