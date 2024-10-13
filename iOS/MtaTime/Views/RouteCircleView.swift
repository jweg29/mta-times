//
//  RouteCircle.swift
//  MtaTime
//
//  Created by James Wegner on 10/8/24.
//

import Foundation
import SwiftUI

struct RouteCircleView: View {
    enum Size {
        case standard
        case small
        case verySmall
        case large
    }

    let route: Route
    let size: Size

    private var color: Color {
        return Color(route.routeColor)
    }

    private var title: String {
        return route.shortName
    }

    private var circleSize: CGSize {
        switch size {
        case .standard:
            return .init(width: 50, height: 50)
        case .small:
            return .init(width: 25, height: 25)
        case .large:
            return .init(width: 100, height: 100)
        case .verySmall:
            return .init(width: 20, height: 20)
        }
    }

    private var font: Font {
        switch size {
        case .standard:
            return .title3
        case .small:
            return .body
        case .large:
            return .title
        case .verySmall:
            return .caption
        }
    }

    var body: some View {
        ZStack {
            RoundedRectangle(cornerSize: CGSize(width: 15, height: 15))
                .fill(color)
                .frame(minWidth: circleSize.width, maxWidth: circleSize.width, minHeight: circleSize.width, maxHeight:circleSize.width)
                .clipShape(Circle())
            Text(title)
                .foregroundStyle(Color(route.routeTextColor))
                .font(font)
                .fontWeight(.bold)
        }
    }
}

#Preview {
    RouteCircleView(
        route: Route(
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
        size: .small)
}

