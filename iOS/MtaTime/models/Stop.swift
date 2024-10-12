//
//  Item.swift
//  MtaTime
//
//  Created by James Wegner on 7/14/24.
//

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
}
