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

    @Published private(set) var counter: Int = 0
    @Published private(set) var nearestStops: [Stop]?

    @Published private(set) var userLocation: CLLocationCoordinate2D? {
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

        let fetchedStops = try? await NetworkService.shared.fetchNearbyStops(coordinate: userLocation)
        self.nearestStops = fetchedStops
        print("nearestStops updated: \(self.nearestStops?.count) items")
        //testFunc()

        /*print("fetchNearbyStops")
        do {
            let fetchedStops = try await NetworkService.shared.fetchNearbyStops(coordinate: userLocation)
            //await MainActor.run {
            DispatchQueue.main.async {
                self.nearestStops = fetchedStops
                print("nearestStops updated: \(self.nearestStops?.count) items")
                self.nearestStops = []
                self.testFunc()
            }

            //}
        } catch {
            print("Error fetching nearby stop: \(error)")
        }*/

    }

    func testFunc() {
        self.objectWillChange.send()  // Manually trigger the change notification
        print("testFunc() called")
        self.nearestStops = []
        self.counter += 1
        print("counter = \(counter)")
        self.objectWillChange.send()  // Manually trigger the change notification
    }
}

extension NearestStopViewModel: @preconcurrency LocationManagerDeleate {

    func didUpdateLocations(_ locations: [CLLocation]) {
        if /*userLocation == nil,*/
        let newLocation = locations.last {
            userLocation = newLocation.coordinate
        }
    }
}
