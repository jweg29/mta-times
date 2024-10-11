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
    let gtfsTrip: GTFSTrip
}

struct GTFSTrip: Codable {
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

    /*init(routeId: String, tripId: String, serviceId: String, tripHeadsign: String, directionId: String, shapeId: String) {
     self.routeId = routeId
     self.tripId = tripId
     self.serviceId = serviceId
     self.tripHeadsign = tripHeadsign
     self.directionId = directionId
     self.shapeId = shapeId
     }

     init(from decoder: any Decoder) throws {
     let container = try decoder.container(keyedBy: CodingKeys.self)
     self.routeId = try container.decode(String.self, forKey: .routeId)
     self.tripId = try container.decode(String.self, forKey: .tripId)
     self.serviceId = try container.decode(String.self, forKey: .serviceId)
     self.tripHeadsign = try container.decode(String.self, forKey: .tripHeadsign)
     self.directionId = try container.decode(String.self, forKey: .directionId)
     self.shapeId = try container.decode(String.self, forKey: .shapeId)
     }*/
}
