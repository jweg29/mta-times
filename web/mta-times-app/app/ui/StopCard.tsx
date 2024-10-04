'use client';

import { Card, Space, Text } from '@mantine/core';
import React from 'react';
import { useStopSelection } from '../StopSelectionContext';
import RoutesDisplay from './RoutesDisplay';

const StopCard: React.FC = () => {
    const { selectedStop } = useStopSelection(); // Get selectedStop from context

    let routesDisplay = "";
    if (selectedStop != null && selectedStop.routes != null) {
        selectedStop.routes.forEach(route => {
            routesDisplay += route.gtfsRoute.route_short_name + " ";
        })
    }

    return (
        selectedStop != null
            ?
            <>
                <Card shadow="sm" padding="lg" radius="md" withBorder style={{
                    display: 'flex',          // Flexbox layout
                    justifyContent: 'center', // Center horizontally
                    alignItems: 'center',     // Center vertically
                    textAlign: 'center',      // Center text (if any) horizontally
                }}>
                    <Text fw={700}>{selectedStop.gtfsStop.stop_name}</Text>
                    <Space h="sm" />
                    <RoutesDisplay routes={selectedStop.routes} />
                </Card>
            </>
            : <></>
    );
}

export default StopCard;