//
//  NetworkService.swift
//  MtaTime
//
//  Created by James Wegner on 10/7/24.
//

import Combine
import CoreLocation
import Foundation
import SwiftUI

enum NetworkError: LocalizedError {
    case invalidURL
    case serverError(Int)
    case invalidResponse

    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "Invalid URL"
        case .serverError(let code):
            return "The server encountered an error. Status code: \(code)"
        case .invalidResponse:
            return "No server response."
        }
    }
}

enum Endpoint {
    static let host = "https://mta-times.vercel.app"

    case fetchStops
    case fetchNearbyStops(CLLocationCoordinate2D)
    case fetchDepartures(Stop)

    var url: URL? {
        switch self {
        case .fetchStops:
            return URL(string: "\(Endpoint.host)/api/stops")
        case .fetchNearbyStops(let coordinate):
            return URL(string: "\(Endpoint.host)/api/stops?lat=\(coordinate.latitude)&lon=\(coordinate.longitude)")
        case .fetchDepartures(let stop):
            return URL(string: "\(Endpoint.host)/api/departures?stopId=\(stop.gtfsStopId)")
        }
    }
}

public final class NetworkService: NSObject, Sendable {

    public static let shared = NetworkService()

    private override init() {}

    func fetchNearbyStops(coordinate: CLLocationCoordinate2D) async throws -> [Stop] {
        guard let url = Endpoint.fetchNearbyStops(coordinate).url else {
            throw NetworkError.invalidURL
        }

        let (data, _) = try await URLSession.shared.data(from: url)

        let decoder = JSONDecoder()
        return try decoder.decode([Stop].self, from: data)
    }

    func fetchDepartures(stop: Stop) async throws -> [Departure] {
        /*return [
            Departure(id: "0",
                      trip:
                        Trip(tripId: "0",
                             startDate: "",
                             routeId: "",
                             route:
                                Route(id: 0,
                                      gtfsRouteId: "0",
                                      agencyId: "",
                                      shortName: "A",
                                      longName: "A",
                                      type: "",
                                      routeDescription: "",
                                      url: "",
                                      color: "#2850AD",
                                      textColor: "",
                                      liveFeedURL: ""),
                             gtfsTrip:
                                GTFSTrip(
                                    routeId: "A",
                                    tripId: "",
                                    serviceId: "A",
                                    tripHeadsign: "Far Rockaway-Mott Av",
                                    directionId: "1",
                                    shapeId: "")),
                      departureTime: "",
                      departureDisplay: "now",
                      departureDisplayShort: "now",
                      isRealtime: true,
                      directionId: "1"),
            ////
            Departure(id: "1",
                      trip:
                        Trip(tripId: "1",
                             startDate: "",
                             routeId: "",
                             route:
                                Route(id: 1,
                                      gtfsRouteId: "1",
                                      agencyId: "",
                                      shortName: "C",
                                      longName: "C",
                                      type: "",
                                      routeDescription: "",
                                      url: "",
                                      color: "#2850AD",
                                      textColor: "",
                                      liveFeedURL: ""),
                             gtfsTrip:
                                GTFSTrip(
                                    routeId: "C",
                                    tripId: "1",
                                    serviceId: "C",
                                    tripHeadsign: "168 St",
                                    directionId: "0",
                                    shapeId: "")),
                      departureTime: "",
                      departureDisplay: "2 minutes",
                      departureDisplayShort: "2 minutes",
                      isRealtime: true,
                      directionId: ""),
        ]*/

        guard let url = Endpoint.fetchDepartures(stop).url else {
            throw NetworkError.invalidURL
        }

        let (data, response) = try await URLSession.shared.data(from: url)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.invalidResponse
        }

        guard (200...299).contains(httpResponse.statusCode) else {
            throw NetworkError.serverError(httpResponse.statusCode)
        }

        let decoder = JSONDecoder()
        return try decoder.decode([Departure].self, from: data)
    }
}

/*
 {
   "trip": {
     "tripId": "093800_A..S58R",
     "startDate": "20241008",
     "scheduleRelationship": 0,
     "routeId": "A",
     "route": {
       "id": 131,
       "gtfsRouteId": "A",
       "agencyId": "MTA NYCT",
       "shortName": "A",
       "longName": "8 Avenue Express",
       "type": "1",
       "routeDescription": "Trains operate between Inwood-207 St, Manhattan and Far Rockaway-Mott Avenue, Queens at all times. Also from about 6 AM until about midnight, additional trains operate between Inwood-207 St and Lefferts Boulevard (trains typically alternate between Lefferts Blvd and Far Rockaway). During weekday morning rush hours, special trains operate from Rockaway Park-Beach 116 St, Queens, toward Manhattan. These trains make local stops between Rockaway Park and Broad Channel. Similarly, in the evening rush hour special trains leave Manhattan operating toward Rockaway Park-Beach 116 St, Queens.",
       "url": "http://web.mta.info/nyct/service/pdf/tacur.pdf",
       "color": "#2850AD",
       "textColor": "FFFFFF",
       "liveFeedURL": "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace"
     },
     "gtfsTrip": {
       "route_id": "A",
       "trip_id": "BSP24GEN-A086-Weekday-00_093800_A..S58R",
       "service_id": "Weekday",
       "trip_headsign": "Far Rockaway-Mott Av",
       "direction_id": "1",
       "shape_id": "A..S58R"
     }
   },
   "departure_time": "Tue, 08 Oct 2024 20:07:16 GMT",
   "isRealtime": true,
   "departureDisplay": "now",
   "departureDisplayShort": "now",
   "directionId": "1"
 },
 {
   "trip": {
     "tripId": "093150_C..N04R",
     "startDate": "20241008",
     "scheduleRelationship": 0,
     "routeId": "C",
     "route": {
       "id": 133,
       "gtfsRouteId": "C",
       "agencyId": "MTA NYCT",
       "shortName": "C",
       "longName": "8 Avenue Local",
       "type": "1",
       "routeDescription": "Trains operate between 168 St, Manhattan, and Euclid Av, Brooklyn, daily from about 6 AM to 11 PM.",
       "url": "http://web.mta.info/nyct/service/pdf/tccur.pdf",
       "color": "#2850AD",
       "textColor": "FFFFFF",
       "liveFeedURL": "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace"
     },
     "gtfsTrip": {
       "route_id": "C",
       "trip_id": "BSP24GEN-C056-Weekday-00_093150_C..N04R",
       "service_id": "Weekday",
       "trip_headsign": "168 St",
       "direction_id": "0",
       "shape_id": "C..N04R"
     }
   },
   "departure_time": "Tue, 08 Oct 2024 20:07:16 GMT",
   "isRealtime": true,
   "departureDisplay": "now",
   "departureDisplayShort": "now",
   "directionId": "0"
 },
 {
   "trip": {
     "tripId": "093550_C..S04R",
     "startDate": "20241008",
     "scheduleRelationship": 0,
     "routeId": "C",
     "route": {
       "id": 133,
       "gtfsRouteId": "C",
       "agencyId": "MTA NYCT",
       "shortName": "C",
       "longName": "8 Avenue Local",
       "type": "1",
       "routeDescription": "Trains operate between 168 St, Manhattan, and Euclid Av, Brooklyn, daily from about 6 AM to 11 PM.",
       "url": "http://web.mta.info/nyct/service/pdf/tccur.pdf",
       "color": "#2850AD",
       "textColor": "FFFFFF",
       "liveFeedURL": "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace"
     },
     "gtfsTrip": {
       "route_id": "C",
       "trip_id": "BSP24GEN-C056-Weekday-00_093550_C..S04R",
       "service_id": "Weekday",
       "trip_headsign": "Euclid Av",
       "direction_id": "1",
       "shape_id": "C..S04R"
     }
   },
   "departure_time": "Tue, 08 Oct 2024 20:07:16 GMT",
   "isRealtime": true,
   "departureDisplay": "now",
   "departureDisplayShort": "now",
   "directionId": "1"
 },
 {
   "trip": {
     "tripId": "090400_A..N55R",
     "startDate": "20241008",
     "scheduleRelationship": 0,
     "routeId": "A",
     "route": {
       "id": 131,
       "gtfsRouteId": "A",
       "agencyId": "MTA NYCT",
       "shortName": "A",
       "longName": "8 Avenue Express",
       "type": "1",
       "routeDescription": "Trains operate between Inwood-207 St, Manhattan and Far Rockaway-Mott Avenue, Queens at all times. Also from about 6 AM until about midnight, additional trains operate between Inwood-207 St and Lefferts Boulevard (trains typically alternate between Lefferts Blvd and Far Rockaway). During weekday morning rush hours, special trains operate from Rockaway Park-Beach 116 St, Queens, toward Manhattan. These trains make local stops between Rockaway Park and Broad Channel. Similarly, in the evening rush hour special trains leave Manhattan operating toward Rockaway Park-Beach 116 St, Queens.",
       "url": "http://web.mta.info/nyct/service/pdf/tacur.pdf",
       "color": "#2850AD",
       "textColor": "FFFFFF",
       "liveFeedURL": "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace"
     },
     "gtfsTrip": {
       "route_id": "A",
       "trip_id": "BSP24GEN-A086-Weekday-00_090400_A..N55R",
       "service_id": "Weekday",
       "trip_headsign": "Inwood-207 St",
       "direction_id": "0",
       "shape_id": "A..N55R"
     }
   },
   "departure_time": "Tue, 08 Oct 2024 20:09:13 GMT",
   "isRealtime": true,
   "departureDisplay": "1 minute",
   "departureDisplayShort": "1 minute",
   "directionId": "0"
 },
 */
