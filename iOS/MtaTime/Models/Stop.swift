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

    var coordinate: CLLocationCoordinate2D {
        return CLLocationCoordinate2D(
            latitude: CLLocationDegrees(lat) ?? .zero, longitude: CLLocationDegrees(lon) ?? .zero)
    }

    init(
        id: Int, gtfsStopId: String, name: String, lat: String, lon: String, northDirectionLabel: String,
        southDirectionLabel: String, ada: String, adaNotes: String, locationType: String, parentStation: String,
        routes: [Route]
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
    }
}
