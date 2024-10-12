//
//  RouteDisplay.swift
//  MtaTime
//
//  Created by James Wegner on 10/8/24.
//

import Foundation
import SwiftUI

struct RouteDisplay: View {
    let routes: [Route]
    let size: RouteCircleView.Size

    var body: some View {
        HStack {
            ForEach(routes) { route in
                RouteCircleView(route: route, size: size)
            }
        }
    }
}

#Preview {
    RouteDisplay(routes: [
        Route(
            id: 0,
            gtfsRouteId: "A",
            agencyId: "",
            shortName: "A",
            longName: "8 Avenue Express",
            type: "",
            routeDescription: "Trains operate between Inwood-207 St, Manhattan and Far Rockaway-Mott Avenue, Queens at all times. Also from about 6 AM until about midnight, additional trains operate between Inwood-207 St and Lefferts Boulevard (trains typically alternate between Lefferts Blvd and Far Rockaway). During weekday morning rush hours, special trains operate from Rockaway Park-Beach 116 St, Queens, toward Manhattan. These trains make local stops between Rockaway Park and Broad Channel. Similarly, in the evening rush hour special trains leave Manhattan operating toward Rockaway Park-Beach 116 St, Queens.",
            url: "",
            color: "#2850AD",
            textColor: "",
            liveFeedURL: ""),
        Route(
            id: 1,
            gtfsRouteId: "A",
            agencyId: "",
            shortName: "C",
            longName: "8 Avenue Express",
            type: "",
            routeDescription: "Trains operate between Inwood-207 St, Manhattan and Far Rockaway-Mott Avenue, Queens at all times. Also from about 6 AM until about midnight, additional trains operate between Inwood-207 St and Lefferts Boulevard (trains typically alternate between Lefferts Blvd and Far Rockaway). During weekday morning rush hours, special trains operate from Rockaway Park-Beach 116 St, Queens, toward Manhattan. These trains make local stops between Rockaway Park and Broad Channel. Similarly, in the evening rush hour special trains leave Manhattan operating toward Rockaway Park-Beach 116 St, Queens.",
            url: "",
            color: "#2850AD",
            textColor: "",
            liveFeedURL: ""),
        Route(
            id: 2,
            gtfsRouteId: "",
            agencyId: "",
            shortName: "E",
            longName: "8 Avenue Express",
            type: "",
            routeDescription: "Trains operate between Inwood-207 St, Manhattan and Far Rockaway-Mott Avenue, Queens at all times. Also from about 6 AM until about midnight, additional trains operate between Inwood-207 St and Lefferts Boulevard (trains typically alternate between Lefferts Blvd and Far Rockaway). During weekday morning rush hours, special trains operate from Rockaway Park-Beach 116 St, Queens, toward Manhattan. These trains make local stops between Rockaway Park and Broad Channel. Similarly, in the evening rush hour special trains leave Manhattan operating toward Rockaway Park-Beach 116 St, Queens.",
            url: "",
            color: "#2850AD",
            textColor: "",
            liveFeedURL: ""),
    ],
                 size: .standard)
}
