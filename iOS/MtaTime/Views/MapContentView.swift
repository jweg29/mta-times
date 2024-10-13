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
    @StateObject var nearestStopViewModel: NearestStopViewModel = NearestStopViewModel()
    @State private var mapPosition: MapCameraPosition = .userLocation(fallback: .automatic)
    @State private var isSheetPresented: Bool = true

    @State private var selectedItem: MKMapItem? {
        didSet {
            selectedStop = nearestStopViewModel.nearestStops?.first(where: {
                $0.gtfsStopId.hashValue == selectedItem.hashValue
            })
        }
    }

    @State private var selectedStop:
        Stop? /* {
        if let selectedItem {
            return nearestStopViewModel.nearestStops?.first(where: { $0.gtfsStopId.hashValue == selectedItem.hashValue })
        }
        return nil
    }*/

    private var mapMarkerWidth: Double {
        return Double(selectedStop?.routes.count ?? 0) * 1.5
    }

    init( /*viewModel: NearestStopViewModel = NearestStopViewModel(), */region: MKCoordinateRegion? = nil) {
        //nearestStopViewModel = viewModel
        if let region {
            self.mapPosition = MapCameraPosition.region(region)
        }
        LocationManager.shared.requestLocationAccess()
    }

    var body: some View {
        VStack {
            Map(
                position: $mapPosition, interactionModes: .all,
                selection: $selectedItem,
                content: {
                    UserAnnotation()
                    ForEach(nearestStopViewModel.nearestStops ?? [], id: \.gtfsStopId) { stop in
                        Annotation(stop.name, coordinate: stop.coordinate) {
                            Button(action: {
                                selectedStop = stop
                            }) {
                                ZStack {
                                    // Background layer
                                    RoundedRectangle(cornerRadius: 10)
                                        .fill(.ultraThinMaterial)
                                        //.presentationBackground(.thinMaterial)  // set the background of the sheet
                                        .frame(width: /*40*/ (Double(stop.routes.count) * 40), height: 40)
                                        .shadow(radius: 5)

                                    VStack {
                                        /*Image(systemName: "tram.circle.fill")
                                            .resizable()
                                            .frame(width: 30, height: 30)
                                            .foregroundColor(Color(Colors.mtaColor))*/

                                        RouteDisplay(routes: stop.routes, size: .verySmall)
                                    }
                                }
                            }
                        }
                    }
                }
            )
            .mapControls {
                MapUserLocationButton()
                MapCompass()
                MapPitchToggle()
            }
            .mapControlVisibility(.visible)
            .mapStyle(
                .standard(
                    pointsOfInterest:
                        .including([.publicTransport, .restroom])))

        }
        .safeAreaPadding(.bottom, 190)  // Adjust the bottom safe area so the legal Maps text isn't hidden.
        .sheet(isPresented: $isSheetPresented) {
            MapPopOverView(selectedDetent: .fraction(0.33), selectedStop: selectedStop)
                .presentationBackground(.thinMaterial)  // set the background of the sheet
        }
        .onChange(of: nearestStopViewModel.nearestStops) { nearestStops in
            selectedStop = nearestStops?.first
        }
    }
}

struct MapPopOverView: View {

    @State private var searchText = ""
    @State private var searchIsActive = false
    //@State var selectedDetent: PresentationDetent
    var selectedDetent: PresentationDetent

    var selectedStop: Stop?
    //@Binding var selectedStop: Stop?

    var body: some View {
        VStack {
            if let selectedStop {
                StopView(stop: selectedStop)
            } else {
                ProgressView()
                    .progressViewStyle(.automatic)
                    .controlSize(.large)
                    .tint(Color(Colors.mtaColor))
            }
        }
        .interactiveDismissDisabled()
        .presentationDetents([.fraction(0.40), .medium, .large])//, selection: selectedDetent)
        .presentationBackgroundInteraction(.enabled)
        .presentationContentInteraction(.resizes)
    }
}
/*
#Preview {
    MapContentView(
        viewModel: NearestStopViewModel(nearestStops: [
            Stop(
                id: 0,
                gtfsStopId: "6568",
                name: "W 4 St-Wash Sq",
                lat: "40.732338",
                lon: "-74.000495",
                northDirectionLabel: "Uptown",
                southDirectionLabel: "Downtown",
                ada: "0",
                adaNotes: "",
                locationType: "",
                parentStation: "",
                routes: [])
        ]))
}
*/
