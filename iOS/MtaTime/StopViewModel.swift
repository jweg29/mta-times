//
//  StopViewModel.swift
//  MtaTime
//
//  Created by James Wegner on 10/8/24.
//

import Foundation

@MainActor
final class StopViewModel: ObservableObject {

    enum DepartureFilter: Int {
        case all = 0
        case northBound = 1
        case southBound = 2
    }

    @Published var stop: Stop
    @Published var departures: [Departure]

    func filteredDepartures(filter: DepartureFilter) -> [Departure] {
        switch filter {
        case .all:
            return departures
        case .northBound:
            return departures.filter {
                $0.directionId == "0"
            }
        case .southBound:
            return departures.filter {
                $0.directionId == "1"
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
            }
        } catch {
            // Handle errors, e.g., update UI or show an alert
            print("Error fetching train times: \(error)")
        }
    }
}
