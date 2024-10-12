//
//  NearestStopViewModel.swift
//  MtaTime
//
//  Created by James Wegner on 10/11/24.
//

import CoreLocation
import Foundation

@MainActor
final class NearestStopViewModel: ObservableObject {

    @Published var nearestStop: Stop?

    var userLocation: CLLocation? {
        didSet {
            Task {
                await fetchNearbyStops()
                LocationManager.shared.stopLocationUpdates()
            }
        }
    }

    func fetchNearbyStops() async {
        guard let userLocation else { return }

        do {
            let nearbyStops = try await NetworkService.shared.fetchNearbyStops(coordinate: userLocation.coordinate)
            await MainActor.run {
                nearestStop = nearbyStops.first
            }
        } catch {
            // Handle errors, e.g., update UI or show an alert
            print("Error fetching nearby stop: \(error)")
        }
    }
}
