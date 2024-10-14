//
//  Item.swift
//  MtaTime
//
//  Created by James Wegner on 7/14/24.
//

import CoreLocation
import Foundation
import SwiftUI

final class Stop: Codable, Sendable, Equatable, ObservableObject {
    static func == (lhs: Stop, rhs: Stop) -> Bool {
        return lhs.gtfsStopId == rhs.gtfsStopId
    }

    let id: Int
    let gtfsStopId: String
    let name: String
    let lat: String
    let lon: String
    let northDirectionLabel: String
    let southDirectionLabel: String
    let ada: String
    let adaNotes: String
    let locationType: String
    let parentStation: String
    let routes: [Route]
    let entrances: [StopEntrance]?

    var coordinate: CLLocationCoordinate2D {
        return CLLocationCoordinate2D(
            latitude: CLLocationDegrees(lat) ?? .zero, longitude: CLLocationDegrees(lon) ?? .zero)
    }

    init(
        id: Int, gtfsStopId: String, name: String, lat: String, lon: String, northDirectionLabel: String,
        southDirectionLabel: String, ada: String, adaNotes: String, locationType: String, parentStation: String,
        routes: [Route], entrances: [StopEntrance]? = nil
    ) {
        self.id = id
        self.gtfsStopId = gtfsStopId
        self.name = name
        self.lat = lat
        self.lon = lon
        self.northDirectionLabel = northDirectionLabel
        self.southDirectionLabel = southDirectionLabel
        self.ada = ada
        self.adaNotes = adaNotes
        self.locationType = locationType
        self.parentStation = parentStation
        self.routes = routes
        self.entrances = entrances
    }
}

final class StopEntrance: Codable, Equatable, Sendable {
    static func == (lhs: StopEntrance, rhs: StopEntrance) -> Bool {
        lhs.id == rhs.id
    }

    let id: Int
    let lat: String
    let lon: String
    let type: String
    let entryAllowed: Bool
    let exitAllowed: Bool
}

/*model StopEntrance {
    id           Int     @id @default(autoincrement())
    lat          String
    lon          String
    type         String
    entryAllowed Boolean
    exitAllowed  Boolean
    subwayStop   Stop?   @relation(fields: [StopId], references: [id])
    StopId       Int?
}*/
