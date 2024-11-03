//
//  DepartureView.swift
//  MtaTime
//
//  Created by James Wegner on 10/8/24.
//

import Foundation
import SwiftUI

struct DepartureRow: View {
    let departure: Departure

    var body: some View {
        HStack {
            RouteCircleView(route: departure.trip.route, size: .small)
                .padding(.trailing, 4)

            VStack(alignment: .leading) {
                if let headsign = departure.trip.headsign {
                    Text(headsign)
                        .font(.body)
                        .fontWeight(.semibold)
                }

                Text(departure.departureDisplayShort)
                    .font(.body)
            }

        }
    }
}

#Preview {
    DepartureRow(
        departure: Departure(
            id: "",
            trip: Trip(tripId: "",
                       startDate: "",
                       routeId: "",
                       route:
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
                            liveFeedURL: "", shouldDisplay: true),
                       headsign: nil,
                       directionId: nil),
            departureTime: "",
            departureDisplay: "2 minutes",
            departureDisplayShort: "2 minutes",
            isRealtime: true,
            directionId: "0"))
}

