//
//  Item.swift
//  MtaTime
//
//  Created by James Wegner on 7/14/24.
//

import Foundation

struct Stop: Codable {
    let name: String
}

struct Route: Codable {
    let longName: String
    let shortName: String
    let color: String
}
