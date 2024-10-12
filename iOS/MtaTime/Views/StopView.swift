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

    private var options: [String] {
        ["All", stop.northDirectionLabel, stop.southDirectionLabel]
    }

    private var departureFilter: StopViewModel.DepartureFilter {
        StopViewModel.DepartureFilter(rawValue: selectedOption) ?? .all
    }

    @State private var routeDirection = ""
    @State private var selectedOption = 0

    // refresh every 10 seconds
    private let timer = Timer.publish(every: 10, on: .main, in: .common).autoconnect()

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

                    RouteDisplay(routes: stop.routes, size: .small)
                }
                .padding(.bottom, -8)
                .padding(.top, 6)

                //RouteDisplay(routes: stop.routes, size: .standard)

                switch viewModel.state {
                case .initial:
                    List {
                        Section {
                        } header: {
                            Text("Loading...")
                            ProgressView()
                                .progressViewStyle(.automatic)
                        }
                    }
                case .error(let error):
                    Text(error.localizedDescription)
                case .loaded:
                    if viewModel.departures.isEmpty {
                        List {
                            Section {
                            } header: {
                                Text("No upcoming departures 😢")
                            }
                            .headerProminence(.increased)
                        }
                    } else {
                        List {
                            Section {
                                ForEach(
                                    viewModel.filteredDepartures(filter: departureFilter), id: \.id
                                ) { departure in
                                    DepartureRow(departure: departure)
                                }
                            } header: {
                                Picker("Route direction", selection: $selectedOption) {
                                    ForEach(0..<options.count) { index in
                                        Text(options[index]).tag(index)
                                    }
                                }
                                .tint(.blue)
                                .pickerStyle(.segmented)
                                .padding(.bottom, 8)
                                .padding(.top, 8)
                            }
                        }
                        .animation(
                            .default,
                            value: viewModel.departures
                        )
                        .headerProminence(.increased)
                    }
                }
            }
        }
        .onAppear {
            Task {
                await viewModel.fetchDepartures()
            }
        }
        .onReceive(
            timer,
            perform: { _ in
                Task {
                    await viewModel.fetchDepartures()
                }
            })
    }
}
/*
#Preview {
    StopView(
        stop:
            Stop(
                id: 0,
                gtfsStopId: "",
                name: "W 4 St-Wash Sq",
                lat: "",
                lon: "",
                northDirectionLabel: "Uptown",
                southDirectionLabel: "Downtown",
                ada: "",
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
                        gtfsRouteId: "A",
                        agencyId: "",
                        shortName: "C",
                        longName: "8 Avenue Express",
                        type: "",
                        routeDescription:
                            "Trains operate between Inwood-207 St, Manhattan and Far Rockaway-Mott Avenue, Queens at all times. Also from about 6 AM until about midnight, additional trains operate between Inwood-207 St and Lefferts Boulevard (trains typically alternate between Lefferts Blvd and Far Rockaway). During weekday morning rush hours, special trains operate from Rockaway Park-Beach 116 St, Queens, toward Manhattan. These trains make local stops between Rockaway Park and Broad Channel. Similarly, in the evening rush hour special trains leave Manhattan operating toward Rockaway Park-Beach 116 St, Queens.",
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
                        routeDescription:
                            "Trains operate between Inwood-207 St, Manhattan and Far Rockaway-Mott Avenue, Queens at all times. Also from about 6 AM until about midnight, additional trains operate between Inwood-207 St and Lefferts Boulevard (trains typically alternate between Lefferts Blvd and Far Rockaway). During weekday morning rush hours, special trains operate from Rockaway Park-Beach 116 St, Queens, toward Manhattan. These trains make local stops between Rockaway Park and Broad Channel. Similarly, in the evening rush hour special trains leave Manhattan operating toward Rockaway Park-Beach 116 St, Queens.",
                        url: "",
                        color: "#2850AD",
                        textColor: "",
                        liveFeedURL: ""),
                ]
            )
    )
}
*/
