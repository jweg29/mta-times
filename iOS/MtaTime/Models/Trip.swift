//
//  Trip.swift
//  MtaTime
//
//  Created by James Wegner on 10/8/24.
//

import Foundation

struct Trip: Codable {
    let tripId: String
    let startDate: String
    let routeId: String
    let route: Route
    let headsign: String?
    let directionId: String?
    //let gtfsTrip: GTFSTrip
}

/*struct GTFSTrip: Codable {
    let routeId: String
    let tripId: String
    let serviceId: String
    let tripHeadsign: String
    let directionId: String
    let shapeId: String

    private enum CodingKeys: String, CodingKey {
        case routeId = "route_id"
        case tripId = "trip_id"
        case serviceId = "service_id"
        case tripHeadsign = "trip_headsign"
        case directionId = "direction_id"
        case shapeId = "shape_id"
    }
}*/
