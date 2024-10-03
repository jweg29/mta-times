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
                </Card>
            </>
            : <></>
    );
}

export default StopCard;