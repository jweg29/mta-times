//
//  StopView.swift
//  MtaTime
//
//  Created by James Wegner on 10/7/24.
//

import SwiftUI

struct StopView: View {
    let stop: Stop
    @ObservedObject var viewModel: StopViewModel
    @State private var isPresentingSearch = false

    init(stop: Stop) {
        self.stop = stop
        self.viewModel = StopViewModel(stop)
    }

    var body: some View {
        NavigationStack {
            VStack {
                HStack {
                    Text(stop.name)
                        .font(.title)
                        .padding()
                        .fontWeight(.bold)
                        .multilineTextAlignment(.leading)
                    /*Button {

                    } label: {
                        Label("", systemImage: "magnifyingglass")
                            .padding()
                        //.foregroundStyle(.white)
                        //.background(.red)
                    }
                    .sheet(isPresented: $isPresentingSearch) {

                    }*/
                }

                RouteDisplay(routes: stop.routes, size: .standard)

                List(viewModel.departures) { departure in
                    DepartureRow(departure: departure)
                    /*NavigationLink() {
                     //ContentDetailView(listItem: listItem)
                     } label: {
                     //ContentListCell(listItem: listItem)
                     }*/
                }

                Button("Refresh") {
                    Task {
                        await viewModel.fetchDepartures()
                    }
                }
            }
        }
        .onAppear {
            Task {
                await viewModel.fetchDepartures()
            }
        }
    }
}

#Preview {
    StopView(stop:
                Stop(id: 0,
                     gtfsStopID: "",
                     name: "W 4 St-Wash Sq",
                     lat: "",
                     lon: "",
                     northDirectionLabel: "",
                     southDirectionLabel: "",
                     ada: "",
                     adaNotes: "",
                     locationType: "",
                     parentStation: "",
                     routes:
                        [
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
                        ]
                    )
    )
}
