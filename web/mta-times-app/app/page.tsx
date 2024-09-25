import { MantineProvider, Select } from '@mantine/core';
import type { Metadata } from 'next';
import Head from 'next/head';
import Link from "next/link";
import { Suspense } from "react";
//import Dashboard from './ui/Dashboard';
import StopSelection from './ui/StopSelection';
import UpcomingDepartures from './ui/UpcomingDepartures';

//import useSwr from "swr";
//import type { NextApiRequest, NextApiResponse } from 'next';
//import fetch from 'node-fetch';
//import GtfsRealtimeBindings from 'gtfs-realtime-bindings';
//const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const metadata: Metadata = {
    title: 'MTA Times 🚂',
}

export default function Page() {
    "/api/departures?stopId=STOP_ID"
    //const { data, error, isLoading } = useSwr<User[]>("/api/departures?stopId=L10", fetcher);
    //const { data, error, isLoading } = useSwr<User[]>("/api/users", fetcher);
    //if (error) return <div>Failed to load departures</div>;
    //if (isLoading) return <div>Loading...</div>;
    //if (!data) return null;

    return (
        <MantineProvider>
            <h1>MTA API 🚂</h1>
            <Suspense fallback={<p>Loading...</p>}>
                <StopSelection />
            </Suspense>
            <UpcomingDepartures stop={undefined} />
        </MantineProvider>
    );
}