import { MantineProvider, Space } from '@mantine/core';
import { Suspense } from 'react';
import StopSelection from './StopSelection';
import { StopSelectionProvider } from './StopSelectionContext';
import UpcomingDepartures from './ui/UpcomingDepartures';

export default function Page() {
    const containerStyle: React.CSSProperties = {
        padding: '20px',
        maxWidth: '600px',
        margin: '0 auto', // Center the container horizontally
        textAlign: 'center', // Center text inside the container
    };

    return (
        <MantineProvider>
            <div style={containerStyle}>
                <h1>MTA Times 🚂</h1>

                <StopSelectionProvider> {/* Wrap with provider to share state */}
                    <Suspense fallback={<p>Loading...</p>}>
                        <StopSelection />
                    </Suspense>

                    <Space h="md" />
                    {/* <StopCard /> */}
                    {/* <Space h="md" /> */}

                    {/* <Suspense fallback={<p>Loading...</p>}> */}
                    <UpcomingDepartures />
                    {/* </Suspense> */}

                </StopSelectionProvider>
            </div>
        </MantineProvider>
    );
}