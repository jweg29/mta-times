//
//  Departure.swift
//  MtaTime
//
//  Created by James Wegner on 10/8/24.
//

import Foundation

struct Departure: Codable, Identifiable {
    var id: String
    let trip: Trip
    let departureTime: String
    let departureDisplay: String
    let departureDisplayShort: String
    let isRealtime: Bool
    let directionId: String

    private enum CodingKeys: String, CodingKey {
        case id
        case trip
        case departureTime = "departure_time"
        case departureDisplay
        case departureDisplayShort
        case isRealtime
        case directionId
    }

    init(id: String, trip: Trip, departureTime: String, departureDisplay: String, departureDisplayShort: String, isRealtime: Bool, directionId: String) {
        self.id = id
        self.trip = trip
        self.departureTime = departureTime
        self.departureDisplay = departureDisplay
        self.departureDisplayShort = departureDisplayShort
        self.isRealtime = isRealtime
        self.directionId = directionId
    }

    init(from decoder: any Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.trip = try container.decode(Trip.self, forKey: .trip)
        self.id = trip.tripId
        self.departureTime = try container.decode(String.self, forKey: .departureTime)
        self.departureDisplay = try container.decode(String.self, forKey: .departureDisplay)
        self.departureDisplayShort = try container.decode(String.self, forKey: .departureDisplayShort)
        self.isRealtime = try container.decode(Bool.self, forKey: .isRealtime)
        self.directionId = try container.decode(String.self, forKey: .directionId)
    }
}
