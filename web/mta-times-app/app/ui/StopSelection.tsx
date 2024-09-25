import { fetchAllStops } from "../lib/gtfs";
import { Select } from '@mantine/core';

export default async function StopSelection() {
    const stops = (await fetchAllStops()).filter((stop) => (
        // We only want to display parent stops to prevent duplicates.
        stop.parent_station === '' &&
        stop.location_type === '1'
    ));

    return (
        <>
            {<Select
                label="Subway stop"
                placeholder="Pick a stop"
                data={
                    //['React', 'Angular', 'Vue', 'Svelte']
                    stops.map((stop) => (
                        stop.stop_name + ` - (${stop.stop_id})`
                    ))
                }
                searchable
            />}



            {/* <select id="stop-select" name="stops" defaultValue="No stop selected">
                <option value="" disabled>
                    Select a subway stop
                </option>
                {stops.map((stop) => (
                    <option
                        key={stop.stop_id}
                        value={stop.stop_id}>
                        {stop.stop_name}
                    </option>
                ))}
            </select > */}
        </>
    );
}
