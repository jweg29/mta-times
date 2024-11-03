//
//  StopViewModel.swift
//  MtaTime
//
//  Created by James Wegner on 10/8/24.
//

import Foundation

@MainActor
final class StopViewModel: ObservableObject {

    enum State {
        case initial
        case loaded
        case error(Error)
    }

    enum DepartureFilter: Int {
        //case all = 0
        case northBound = 0
        case southBound = 1
    }

    @Published var stop: Stop
    @Published var departures: [Departure]
    @Published var state: State = .initial

    func filteredDepartures(filter: DepartureFilter) -> [Departure] {
        switch filter {
        /*case .all:
            return departures*/
        case .northBound:
            return departures.filter {
                $0.directionId == "N"
            }
        case .southBound:
            return departures.filter {
                $0.directionId == "S"
            }
        }
    }

    init(_ stop: Stop) {
        self.stop = stop
        self.departures = []
        Task {
            await fetchDepartures()
        }
    }

    func fetchDepartures() async {
        do {
            let fetchedDepartures = try await NetworkService.shared.fetchDepartures(stop: stop)
            await MainActor.run {
                self.departures = fetchedDepartures
                state = .loaded
            }
        } catch {
            // Handle errors, e.g., update UI or show an alert
            print("Error fetching train times: \(error)")
            state = .error(error)
        }
    }
}
