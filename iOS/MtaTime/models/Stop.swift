//
//  Item.swift
//  MtaTime
//
//  Created by James Wegner on 7/14/24.
//

import Foundation

struct Stop: Codable {
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
