//
//  Route.swift
//  MtaTime
//
//  Created by James Wegner on 10/8/24.
//

import Foundation
import UIKit

struct Route: Codable, Identifiable {
    let id: Int
    let gtfsRouteId: String
    let agencyId: String
    let shortName: String
    let longName: String
    let type: String
    let routeDescription: String
    let url: String
    let color: String
    let textColor: String
    let liveFeedURL: String
    let shouldDisplay: Bool

    var routeColor: UIColor {
        return UIColor(hex: color)
    }

    var routeTextColor: UIColor {
        return UIColor(hex: textColor)
    }
}


