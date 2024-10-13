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

    @Published var nearestStops: [Stop]?

    var userLocation: CLLocationCoordinate2D? {
        didSet {
            Task {
                await fetchNearbyStops()
            }
        }
    }

    init(nearestStops: [Stop]? = nil) {
        self.nearestStops = nearestStops
        LocationManager.shared.requestLocationAccess()
        LocationManager.shared.startLocationUpdates()
        LocationManager.shared.delegate = self
    }

    func fetchNearbyStops() async {
        guard let userLocation else { return }
        print("fetchNearbyStops")
        do {
            let fetchedStops = try await NetworkService.shared.fetchNearbyStops(coordinate: userLocation)
            await MainActor.run {
                nearestStops = fetchedStops
            }
        } catch {
            print("Error fetching nearby stop: \(error)")
        }
    }
}

extension NearestStopViewModel: @preconcurrency LocationManagerDeleate {

    func didUpdateLocations(_ locations: [CLLocation]) {
        if /*userLocation == nil,*/ let newLocation = locations.last {
            userLocation = newLocation.coordinate
        }
    }
}
