//
//  Item.swift
//  MtaTime
//
//  Created by James Wegner on 7/14/24.
//

import Foundation
import SwiftUI

struct Stop: Codable, Sendable, Equatable, Observable {
    static func == (lhs: Stop, rhs: Stop) -> Bool {
        return lhs.gtfsStopID == rhs.gtfsStopID
    }

    let id: Int
    let gtfsStopID: String
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
