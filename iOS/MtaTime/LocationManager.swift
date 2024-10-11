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

public final class LocationManager: NSObject {

    @MainActor public static let shared = LocationManager()

    private let locationManager: CLLocationManager

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
    }

    public func locationManager(_ manager: CLLocationManager, didFailWithError error: any Error) {
    }

    public func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
    }
}
