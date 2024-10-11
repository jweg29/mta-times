//
//  StopViewModel.swift
//  MtaTime
//
//  Created by James Wegner on 10/8/24.
//

import Foundation

@MainActor
final class StopViewModel: ObservableObject {
    @Published var stop: Stop
    @Published var departures: [Departure]

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
