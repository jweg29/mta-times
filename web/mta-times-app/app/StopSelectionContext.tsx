'use client'

import { Route, Stop } from '@prisma/client';
import React, { createContext, ReactNode, useContext, useState } from 'react';

// Define the shape of the context
type StopSelectionContextType = {
    selectedStop: (Stop & { routes: Route[] }) | null;
    setSelectedStop: (stop: (Stop & { routes: Route[] }) | null) => void;
};

// Create the context with default values
const StopSelectionContext = createContext<StopSelectionContextType | undefined>(undefined);

// Provider component to wrap around components needing this context
export const StopSelectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [selectedStop, setSelectedStop] = useState<(Stop & { routes: Route[] }) | null>(null);

    return (
        <StopSelectionContext.Provider value={{ selectedStop, setSelectedStop }}>
            {children}
        </StopSelectionContext.Provider>
    );
};

// Custom hook to use the StopSelection context
export const useStopSelection = () => {
    const context = useContext(StopSelectionContext);
    if (context === undefined) {
        throw new Error('useStopSelection must be used within a StopSelectionProvider');
    }
    return context;
};