import type { User } from "../interfaces";
import useSwr from "swr";
import Link from "next/link";
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
    <div>
      <h1>MTA API 🚂</h1>
      {/* <ul>
        {data.map((user) => (
          <li key={user.id}>
            <Link href="/user/[id]" as={`/user/${user.id}`}>
              {user.name ?? `User ${user.id}`}
            </Link>
          </li>
        ))}
      </ul> */}
    </div>
  );
}
