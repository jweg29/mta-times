//
//  LocationManager.swift
//  MtaTime
//
//  Created by James Wegner on 10/7/24.
//

import CoreLocation
import Foundation
import Combine
import MapKit
import SwiftUI

protocol LocationManagerDeleate: AnyObject {
    func didUpdateLocations(_ locations: [CLLocation])
}

public final class LocationManager: NSObject, ObservableObject {

    @MainActor public static let shared = LocationManager()

    private let locationManager: CLLocationManager

    //weak var delegate: LocationManagerDeleate?
    @Published var userLocation: CLLocation?

    public func requestLocationAccess() {
        locationManager.requestWhenInUseAuthorization()
    }

    public func startLocationUpdates() {
        locationManager.startUpdatingLocation()
    }

    public func authStatus() -> CLAuthorizationStatus {
        return locationManager.authorizationStatus
    }

    private override init() {
        locationManager = CLLocationManager()
        super.init()
        locationManager.delegate = self
    }
}

extension LocationManager: CLLocationManagerDelegate {

    public func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        print("locationManager didUpdateLocations")
        userLocation = locations.last
       // delegate?.didUpdateLocations(locations)
    }

    public func locationManager(_ manager: CLLocationManager, didFailWithError error: any Error) {
    }

    public func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
    }
}
