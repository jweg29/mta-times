//import type { User } from "../interfaces";
import useSwr from "swr";
import Link from "next/link";
import { Select } from '@mantine/core';
import { MantineProvider } from '@mantine/core';

//import type { NextApiRequest, NextApiResponse } from 'next';
//import fetch from 'node-fetch';
//import GtfsRealtimeBindings from 'gtfs-realtime-bindings';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Index() {

  "/api/departures?stopId=STOP_ID"

  //const { data, error, isLoading } = useSwr<User[]>("/api/departures?stopId=L10", fetcher);
  //const { data, error, isLoading } = useSwr<User[]>("/api/users", fetcher);
  //if (error) return <div>Failed to load departures</div>;
  //if (isLoading) return <div>Loading...</div>;
  //if (!data) return null;

  return (
    <MantineProvider>
      <h1>MTA API 🚂</h1>
      <Select
        label="Select subway stop"
        placeholder="Pick value"
        data={['React', 'Angular', 'Vue', 'Svelte']}
      />
    </MantineProvider>
  );
}
