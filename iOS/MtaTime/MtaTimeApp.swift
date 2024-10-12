//
//  MtaTimeApp.swift
//  MtaTime
//
//  Created by James Wegner on 7/14/24.
//

import CoreLocation
import SwiftData
import SwiftUI

@main
struct MtaTimeApp: App {

    @StateObject private var locationManager = LocationManager.shared

    var nearestStop: Stop?
    let nearestStopViewModel = NearestStopViewModel()

    init() {
        //LocationManager.shared.delegate = self
        LocationManager.shared.requestLocationAccess()
        LocationManager.shared.startLocationUpdates()
    }

    var body: some Scene {
        WindowGroup {
            if let nearestStop {
                StopView(
                    stop: nearestStop
                )
            } else {
                Text("Fetching nearest stop...")
            }

            /*StopView(
                stop:
                    Stop(
                        id: 0,
                        gtfsStopID: "A32",
                        name: "W 4 St-Wash Sq",
                        lat: "",
                        lon: "",
                        northDirectionLabel: "Uptown",
                        southDirectionLabel: "Downtown",
                        ada: "1",
                        adaNotes: "",
                        locationType: "",
                        parentStation: "",
                        routes: [
                            Route(
                                id: 0,
                                gtfsRouteId: "A",
                                agencyId: "",
                                shortName: "A",
                                longName: "8 Avenue Express",
                                type: "",
                                routeDescription:
                                    "Trains operate between Inwood-207 St, Manhattan and Far Rockaway-Mott Avenue, Queens at all times. Also from about 6 AM until about midnight, additional trains operate between Inwood-207 St and Lefferts Boulevard (trains typically alternate between Lefferts Blvd and Far Rockaway). During weekday morning rush hours, special trains operate from Rockaway Park-Beach 116 St, Queens, toward Manhattan. These trains make local stops between Rockaway Park and Broad Channel. Similarly, in the evening rush hour special trains leave Manhattan operating toward Rockaway Park-Beach 116 St, Queens.",
                                url: "",
                                color: "#2850AD",
                                textColor: "",
                                liveFeedURL: ""),
                            Route(
                                id: 1,
                                gtfsRouteId: "C",
                                agencyId: "",
                                shortName: "C",
                                longName: "8 Avenue Local",
                                type: "",
                                routeDescription:
                                    "Trains operate between Inwood-207 St, Manhattan and Far Rockaway-Mott Avenue, Queens at all times. Also from about 6 AM until about midnight, additional trains operate between Inwood-207 St and Lefferts Boulevard (trains typically alternate between Lefferts Blvd and Far Rockaway). During weekday morning rush hours, special trains operate from Rockaway Park-Beach 116 St, Queens, toward Manhattan. These trains make local stops between Rockaway Park and Broad Channel. Similarly, in the evening rush hour special trains leave Manhattan operating toward Rockaway Park-Beach 116 St, Queens.",
                                url: "",
                                color: "#2850AD",
                                textColor: "",
                                liveFeedURL: ""),
                            Route(
                                id: 2,
                                gtfsRouteId: "E",
                                agencyId: "",
                                shortName: "E",
                                longName: "8 Avenue Local",
                                type: "",
                                routeDescription:
                                    "Trains operate between Inwood-207 St, Manhattan and Far Rockaway-Mott Avenue, Queens at all times. Also from about 6 AM until about midnight, additional trains operate between Inwood-207 St and Lefferts Boulevard (trains typically alternate between Lefferts Blvd and Far Rockaway). During weekday morning rush hours, special trains operate from Rockaway Park-Beach 116 St, Queens, toward Manhattan. These trains make local stops between Rockaway Park and Broad Channel. Similarly, in the evening rush hour special trains leave Manhattan operating toward Rockaway Park-Beach 116 St, Queens.",
                                url: "",
                                color: "#2850AD",
                                textColor: "",
                                liveFeedURL: ""),
                        ]
                    )
            )*/
        }
        .onChange(of: locationManager.userLocation) { newLocation in
            nearestStopViewModel.userLocation = newLocation
            /*if let location = newLocation {
                Task {
                    let nearbyStops = try await NetworkService.shared.fetchNearbyStops(coordinate: location.coordinate)
                    nearestStop = nearbyStops.first
                }
                //fetchDataForLocation(location)
            }*/
        }
    }
}
