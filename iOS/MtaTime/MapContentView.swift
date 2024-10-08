//
//  MapContentView.swift
//  MtaTime
//
//  Created by James Wegner on 10/7/24.
//

import CoreLocation
import Foundation
import MapKit
import SwiftUI
import UIKit

struct MapContentView: View {

    @State private var mapPosition: MapCameraPosition = .userLocation(fallback: .automatic)
    @State private var isSheetPresented: Bool = true

    init(region: MKCoordinateRegion? = nil) {
        if let region {
            self.mapPosition = MapCameraPosition.region(region)
        }
        LocationManager.shared.requestLocationAccess()
    }

    var body: some View {
        VStack {
            Map(position: $mapPosition, interactionModes: .all, content: {
                UserAnnotation()
            })
            .mapControls {
                MapUserLocationButton()
                MapCompass()
                MapPitchToggle()
                MapScaleView()
            }
            .mapControlVisibility(.visible)
        }
        .safeAreaPadding(.bottom, 190) // Adjust the bottom safe area so the legal Maps text isn't hidden.
        .sheet(isPresented: $isSheetPresented) {
            //ContentListView(listItems: [])
        }
    }
}

#Preview {
    MapContentView()
}
