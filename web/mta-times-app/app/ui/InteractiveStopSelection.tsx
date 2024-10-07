'use client'

import { Select } from '@mantine/core';
import { Route, Stop } from '@prisma/client';
import { stopRoutesDisplayString } from 'modelHelpers';
import { useStopSelection } from '../StopSelectionContext';

type Props = {
    stops: (Stop & { routes: Route[] })[],
};

const InteractiveStopSelection: React.FC<Props> = ({ stops }) => {
    const { setSelectedStop } = useStopSelection(); // Get setSelectedStop from context

    // Handler function to update the selected subway stop
    const handleSelectChange = (value: string | null) => {
        const stop = stops.find((stop) => stop.gtfsStopId === value) || null;
        if (stop === null) {
            console.log(`stop with id ${value} not found`)
            return;
        }
        console.log(`picked new stop: ${stop.name}`)
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
                            value: stop.gtfsStopId,
                            label: `${stop.name} - (${stopRoutesDisplayString(stop)})`
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