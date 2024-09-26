'use client';

import { Card, Text } from '@mantine/core';
import { useStopSelection } from '../StopSelectionContext';

const StopCard: React.FC = () => {
    const { selectedStop } = useStopSelection(); // Get selectedStop from context
    return (
        selectedStop != null
            ?
            <>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Text fw={700}>{selectedStop.stop_name}</Text>
                    <Text size="md">Stop ID: {selectedStop.stop_id}</Text>
                    <Text size="md">Latitude: {selectedStop.stop_lat} Longitude: {selectedStop.stop_lon}</Text>
                </Card>
            </>
            : <p>Stop is null ⚠️</p>
    );
}

export default StopCard;