import { StopEntrance } from '@prisma/client';
import AdmZip from 'adm-zip';
import fs, { writeFileSync } from 'fs';
import { NextResponse } from 'next/server';
import fetch from 'node-fetch';
import path from 'path';
import { CSVStation, EntranceData, TripPath } from './definitions';
import { loadRoutesFromStaticFiles } from './gtfsHelpers/routes';
import { loadStopsFromStaticFiles } from './gtfsHelpers/stops';
import { loadTripsFromStaticFiles } from './gtfsHelpers/trips';
import prisma from './prisma';
import { parseCSV } from "./utils";

/**
 * Syncs data from the static gtfs files and populates the database.
 */
export const syncGTFSData = async () => {
    // Trips data: For now just manually upload CSV
    /*await prisma.gTFSTrip.deleteMany({});

    const gtfsTrips = await loadTripsFromStaticFiles()

    for (const trip of gtfsTrips) {
        const createdTrip = await prisma.gTFSTrip.create({
            data: {
                gtfsTripId: trip.trip_id,
                routeId: trip.route_id,
                serviceId: trip.service_id,
                tripHeadsign: trip.trip_headsign,
                directionId: trip.direction_id,
                shapeId: trip.shape_id,
            },
        })
        console.log(`Created trip with id: ${createdTrip.id}`)
    }*/

    /*try {
        // Create a function to handle each object creation with logging
        const createTrip = async (trip: GTFSTripData) => {
            const createdTrip = await prisma.gTFSTrip.create({
                data: {
                    gtfsTripId: trip.trip_id,
                    routeId: trip.route_id,
                    serviceId: trip.service_id,
                    tripHeadsign: trip.trip_headsign,
                    directionId: trip.direction_id,
                    shapeId: trip.shape_id,
                },
            })
            console.log(`Created trip with id: ${createdTrip.id}`)
            return createdTrip;
        };

        // Use Promise.all to parallelize object creation
        const createdTrips = await Promise.all(gtfsTrips.map(createTrip));
        console.log(`Finished creating trips ✅`)
        return createdTrips;
    } catch (error) {
        console.error('Error creating trips:', error);
    } finally {
        await prisma.$disconnect();
    }*/

    //await prisma.$disconnect();
    //return; // HERE SO WE DON'T ACCIDENTLY RE SYNC

    // Stop times
    // TODO

    // Pre-process Headsigns
    /** 
     * Given a trip id we want to obtain a headsign.
     * Example Trip id: "ASP24GEN-1038-Sunday-00_000600_1..S03R"
     * Split by the "." OR ".." then take the second segment: "S03R"
     * Ignore first char since that represents the direction "N/S": "03R"
     * Map this string to a headsign: { "03R": "South Ferry" }
     */

    // Contains both "parts" of: 097200_A..N55R

    const gtfsTrips = await loadTripsFromStaticFiles()
    const headsignMap = new Map<string, TripPath>();
    const tripPathDict: { [key: string]: TripPath } = {};

    for (const trip of gtfsTrips) {
        let idSegments;
        idSegments = trip.trip_id.split("..");
        if (idSegments.length == 1) {
            idSegments = trip.trip_id.split(".");
        }

        const pathId = idSegments[1]//.slice(1);

        const tripPath: TripPath = {
            routeId: trip.route_id,
            pathId: pathId,
            headsign: trip.trip_headsign,
        };

        const tripPathKey = trip.route_id + pathId;

        if (headsignMap.get(tripPathKey) == null) {
            headsignMap.set(tripPathKey, tripPath)
            tripPathDict[tripPathKey] = tripPath;

            console.log(`Mapped headsign key: ${tripPathKey} to: ${trip.trip_headsign}`)
        } else if (headsignMap.get(tripPathKey).headsign != trip.trip_headsign) {
            console.log(`WARNING: Duplicate headsign key: ${tripPathKey} value: ${trip.trip_headsign}, saved value = ${headsignMap.get(tripPathKey).headsign} `)
        }
    }

    // Write the dictionary to disk

    // Write to a file (e.g., 'output.json')
    try {
        // Convert to JSON format
        //const jsonData = JSON.stringify(headsignMap, null, 2); // `null, 2` adds indentation for readability
        console.log(headsignMap.values[0])
        const jsonData = JSON.stringify(tripPathDict);
        const headsignMapPath = path.join(process.cwd(), 'app', 'lib', 'staticGTFS', 'headsignMap.json');
        await writeFileSync(headsignMapPath, jsonData, 'utf8');
        console.log(`Data has been written to ${headsignMapPath}`);
    } catch (error) {
        console.error("An error occurred while writing the file:", error);
    }

    // STOP
    return;

    // Stations data
    const stationsPath = path.join(process.cwd(), 'app', 'lib', 'staticGTFS', 'stations.csv');
    const parsedStations = parseCSV(stationsPath);

    const stationsMap = new Map<string, CSVStation>();
    const stations: CSVStation[] = parsedStations.map((data) => {
        const station: CSVStation = {
            stopId: data["gtfs_stop_id"],
            northDirectionLabel: data["north_direction_label"],
            southDirectionLabel: data["south_direction_label"],
            division: data["division"],
            line: data["line"],
            stopName: data["stop_name"],
            ada: data["ada"],
            adaNotes: data["ada_notes"]
        };

        stationsMap.set(station.stopId, station);
        return station;
    });

    // Entrance data
    await prisma.stopEntrance.deleteMany({});

    const entrancePath = path.join(process.cwd(), 'app', 'lib', 'staticGTFS', 'entrances.csv');
    const parsedEntrances = parseCSV(entrancePath);

    const entranceMap = new Map<string, EntranceData>();
    const entrances: EntranceData[] = parsedEntrances.map((data) => {
        const entranceData: EntranceData = {
            gtfsStopId: data["GTFS Stop ID"],
            lat: data["Entrance Latitude"],
            lon: data["Entrance Longitude"],
            type: data["Entrance Type"],
            entryAllowed: data["Entry Allowed"],
            exitAllowed: data["Exit Allowed"],
        };
        entranceMap.set(entranceData.gtfsStopId, entranceData);
        return entranceData;
    });

    let createdEntrances: StopEntrance[] = []
    for (const entranceData of entrances) {
        const createdEntrance = await prisma.stopEntrance.create({
            data: {
                gtfsStopId: entranceData.gtfsStopId,
                lat: entranceData.lat,
                lon: entranceData.lon,
                type: entranceData.type,
                entryAllowed: Boolean(entranceData.entryAllowed),
                exitAllowed: Boolean(entranceData.exitAllowed)
            }
        });

        if (createdEntrance != undefined) {
            createdEntrances.push(createdEntrance);
            console.log(`Created StopEntrance for entrance with stop id: ${entranceData.gtfsStopId}`)
        } else {
            console.error(`Unable to create StopEntrance for entrance with stop id: ${entranceData.gtfsStopId}`)
        }
    }

    console.log(`Finished creating stop entrances ✅`)

    // Setup Stops

    const stops = await loadStopsFromStaticFiles();

    stops.forEach(stop => {
        const station = stationsMap.get(stop.gtfsStop.stop_id);
        if (station != null) {
            stop.northDirectionLabel = station.northDirectionLabel;
            stop.southDirectionLabel = station.southDirectionLabel;
            stop.ada = station.ada;
            stop.adaNotes = station.adaNotes;
        } else {
            // This happens for some reason so just set a default text and log it.
            console.error(`Unable to map GTFS Stop to station. GTFS ID: ${stop.gtfsStop.stop_id}`)
            stop.northDirectionLabel = "";
            stop.southDirectionLabel = "";
            stop.ada = "";
            stop.adaNotes = "";
        }
    });

    // TODO: Consolidate and normalize stops
    /*
    ** There are some stops that should be consolidated. Geographically they are in the same location and they also have the same alphabetical name.
    **
    ** Examples:
    ** - W 4 St-Wash Sq
    ** - 59 St-Columbus Circle
    ** - Broadway Junction
    ** - Grand Central
    ** - Times Sq-42 St
    ** - 34 St-Herald Sq
    ** - 14 St-Union Sq
    ** - Canal St
    ** - Delancy St-Essex St
    ** - Jay St-MetroTech
    ** - Atlantic Av-Barclays Ctr
    */

    // Setup Routes
    const routes = await loadRoutesFromStaticFiles()
    // Delete all records from the Route table
    if (routes != null && routes.length > 0) {
        await prisma.route.deleteMany({});
    } else {
        throw Error('Unable to parse and load static GTFS routes.')
    }

    // maps a route's GTFS ID to its corresponding server ID.
    const routeGTFSIdMap = new Map<string, number>()

    for (const route of routes) {
        let textColor: string = "#FFFFFF"

        // NQRW has black text
        if (route.gtfsRoute.route_id.charAt(0) == "N" || route.gtfsRoute.route_id.charAt(0) == "Q" || route.gtfsRoute.route_id.charAt(0) == "R" || route.gtfsRoute.route_id.charAt(0) == "W") {
            textColor = "#000000"
        }

        // Set route group ordering:
        // 1,2,3 = 0
        // 4,5,6 = 1
        // 7 = 2
        // ACE = 3
        // BDFM = 4
        // G = 5
        // JZ = 6
        // NQRW = 7
        // L = 8

        let groupOrder = 0;
        if (route.gtfsRoute.route_id == "1" || route.gtfsRoute.route_id == "2" || route.gtfsRoute.route_id == "3") {
            groupOrder = 0
        } else if (route.gtfsRoute.route_id == "4" || route.gtfsRoute.route_id == "5" || route.gtfsRoute.route_id == "6") {
            groupOrder = 1
        } else if (route.gtfsRoute.route_id == "7") {
            groupOrder = 2
        } else if (route.gtfsRoute.route_id == "A" || route.gtfsRoute.route_id == "C" || route.gtfsRoute.route_id == "E") {
            groupOrder = 4
        } else if (route.gtfsRoute.route_id == "B" || route.gtfsRoute.route_id == "D" || route.gtfsRoute.route_id == "F" || route.gtfsRoute.route_id == "M") {
            groupOrder = 5
        } else if (route.gtfsRoute.route_id == "J" || route.gtfsRoute.route_id == "Z") {
            groupOrder = 6
        } else if (route.gtfsRoute.route_id == "N" || route.gtfsRoute.route_id == "Q" || route.gtfsRoute.route_id == "R" || route.gtfsRoute.route_id == "W") {
            groupOrder = 7
        }

        try {
            const createdRoute = await prisma.route.create({
                data: {
                    gtfsRouteId: route.gtfsRoute.route_id,
                    agencyId: route.gtfsRoute.agency_id,
                    shortName: route.gtfsRoute.route_short_name,
                    longName: route.gtfsRoute.route_long_name,
                    type: route.gtfsRoute.route_type,
                    routeDescription: route.gtfsRoute.route_desc,
                    url: route.gtfsRoute.route_url,
                    color: route.gtfsRoute.route_color,
                    textColor: textColor,
                    liveFeedURL: route.liveFeedUrl,
                    shouldDisplay: route.gtfsRoute.route_id.charAt(route.gtfsRoute.route_id.length - 1) != "X",
                    groupOrder: groupOrder
                },
            })
            routeGTFSIdMap.set(route.gtfsRoute.route_id, createdRoute.id)

            console.log(`Created route with ID: ${createdRoute.id}`)
        } catch (error) {
            console.error(`Error creating database for route: ${route}`, error);
            throw error;
        }
    }

    // Make Route modifications

    // if ends in X then don't display


    console.log(`Finished creating routes ✅`);

    // Delete all records from the Stop table
    if (stops != null && stops.length > 0) {
        await prisma.stop.deleteMany({});
    } else {
        throw Error('Unable to parse and load static GTFS stops.')
    }

    /*const entranceServiceIds = createdEntrances.map(entrance => {
               return { id: entrance.id }
           })*/
    /*const entranceServiceIds = fetchedEntrances.map(entrance => {
        return { id: entrance.id }
    })*/


    for (const stop of stops) {
        try {
            const routeServerIds = stop.routes.map(route => {
                const serverId = routeGTFSIdMap.get(route.gtfsRoute.route_id)
                return { id: serverId }
            })


            const stopEntranceIds = createdEntrances.filter(entrance => {
                return entrance.gtfsStopId == stop.gtfsStop.stop_id
            }).map(entrance => {
                return { id: entrance.id }
            });

            const createdStop = await prisma.stop.create({
                data: {
                    gtfsStopId: stop.gtfsStop.stop_id,
                    name: stop.gtfsStop.stop_name,
                    lat: stop.gtfsStop.stop_lat,
                    lon: stop.gtfsStop.stop_lon,
                    northDirectionLabel: stop.northDirectionLabel,
                    southDirectionLabel: stop.southDirectionLabel,
                    ada: stop.ada,
                    adaNotes: stop.adaNotes,
                    locationType: stop.gtfsStop.location_type,
                    parentStation: stop.gtfsStop.parent_station,
                    routes: {
                        connect: routeServerIds
                    },
                    entrances: {
                        connect: stopEntranceIds
                    },
                }
            })
            console.log(`Created stop with ID: ${createdStop.id}`)
        } catch (error) {
            console.error(`Error creating database for stop: ${stop}`, error);
            throw error;
        }
    }

    console.log(`Finished creating stops ✅`)

    // Setup StopTimes

    // Close Prisma
    await prisma.$disconnect();
};

/**
 * Downloads and updates the latest static GTFS files.
 */
export const updateStaticGTFS = async (): Promise<NextResponse> => {
    // first download the stations file
    const stationsUrl = 'https://data.ny.gov/resource/39hk-dx4f.csv';
    const stationsRespnose = await fetch(stationsUrl);
    const arrayBuffer = await stationsRespnose.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer); // Convert to Uint8Array
    const stationsPath = path.join(process.cwd(), 'app', 'lib', 'staticGTFS', 'stations.csv');
    fs.writeFileSync(stationsPath, buffer);

    /// now handle the GTFS data

    const url = 'http://web.mta.info/developers/files/google_transit_supplemented.zip';
    const zipPath = path.join(process.cwd(), 'app', 'lib', 'staticGTFS', 'google_transit_supplemented.zip');
    const extractPath = path.join(process.cwd(), 'app', 'lib', 'staticGTFS'); // Change this to your desired directory

    try {
        // Step 1: Download the ZIP file
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer); // Convert to Uint8Array

        // Step 2: Save the ZIP file
        fs.writeFileSync(zipPath, buffer);

        // Step 3: Extract the ZIP file
        const zip = new AdmZip(zipPath);
        zip.extractAllTo(extractPath, true);

        // Step 4: Clean up by removing the ZIP file
        fs.unlinkSync(zipPath);
        return NextResponse.json({ "response": "GTFS files downloaded and synced ✅" }, { status: 200 });

    } catch (error) {
        console.error('Error downloading or extracting the file:', error);
        return NextResponse.json(
            { error: `Failed to sync GTFS static files: ${error}` },
            { status: 500 }
        )
    }
}