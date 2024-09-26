'use client'

import { Select } from '@mantine/core';
import { useStopSelection } from '../StopSelectionContext';
import { Stop } from "../lib/definitions";

type Props = {
    stops: Stop[],
};

// Define the functional component with React.FC<StopSelectionProps>
const InteractiveStopSelection: React.FC<Props> = ({ stops }) => {
    const { setSelectedStop } = useStopSelection(); // Get setSelectedStop from context

    // Handler function to update the selected subway stop
    const handleSelectChange = (value: string | null) => {
        const stop = stops.find((stop) => stop.stop_id === value) || null;
        if (stop === null) {
            console.log(`stop with id ${value} not found`)
            return;
        }
        console.log(`picked new stop: ${stop.stop_name}`)
        setSelectedStop(stop); // Update the context with the selected stop object
    };

    return (
        <>
            {<Select
                label="Subway stops"
                placeholder="Select a stop"
                data={
                    stops.map((stop) => (
                        {
                            value: stop.stop_id,
                            label: stop.stop_name + ` - (${stop.stop_id})`
                        }
                    ))
                }
                searchable
                onChange={handleSelectChange}
            />}
        </>
    );
}

export default InteractiveStopSelection;