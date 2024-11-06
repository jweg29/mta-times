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
import Combine

struct MapContentView: View {
    @StateObject private var nearestStopViewModel = NearestStopViewModel()
    @State private var mapPosition: MapCameraPosition = .userLocation(fallback: .automatic)
    @State private var isSheetPresented: Bool = true
    @State private var selectedItem: MKMapItem? {
        didSet {
            selectedStop = nearestStopViewModel.nearestStops?.first(where: {
                $0.gtfsStopId.hashValue == selectedItem.hashValue
            })
        }
    }

    var stopEntrances: [StopEntrance] {
        let allEntrances = nearestStopViewModel.nearestStops?.flatMap({ stop in
            return stop.entrances ?? []
        })

        return allEntrances ?? []
    }

    @State private var selectedStop:Stop?

    private var mapMarkerWidth: Double {
        return Double(selectedStop?.routes.count ?? 0) * 1.5
    }

    init(region: MKCoordinateRegion? = nil) {
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

                    if let selectedStop {
                        ForEach(selectedStop.entrances ?? []) { entrance in
                            Annotation("", coordinate: entrance.coordinate) {
                                EntranceAnnotationView(entrance: entrance)
                                    .zIndex(-1)
                            }
                        }
                    }

                    ForEach(nearestStopViewModel.nearestStops ?? []) { stop in
                        Annotation(stop.name, coordinate: stop.coordinate) {
                            StopAnnotationView(stop: stop, selectedStop: $selectedStop)
                                .zIndex(100)
                        }
                    }

                    /*ForEach(stopEntrances) { entrance in
                        Annotation("", coordinate: entrance.coordinate) {
                            EntranceAnnotationView(entrance: entrance)
                                .zIndex(-1)
                        }
                    }*/
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
        .onChange(of: nearestStopViewModel.nearestStops) { prevValue, nearestStops in
            print("onChange for nearestStops: \(nearestStops?.count ?? 0) stops found")
            //if prevValue?.count == 0 {
                selectedStop = nearestStops?.first
            //}
        }
        .onChange(of: nearestStopViewModel.counter) { prevValue, counter in
            print("onChange for nearestStopViewModel counter: \(String(counter))")
        }
    }
}

struct StopAnnotationView: View {

    let stop: Stop
    @Binding var selectedStop: Stop?

    var body: some View {
        Button(action: {
            selectedStop = stop
        }) {
            ZStack {
                RoundedRectangle(cornerRadius: 10)
                    .fill(.ultraThinMaterial)
                    .frame(width: /*40*/ (Double(stop.routes.count) * 26), height: 26)
                    .shadow(radius: 5)

                VStack {
                    RouteDisplay(routes: stop.routes, size: .verySmall)
                }
            }
        }
    }
}

struct EntranceAnnotationView: View {

    @State var entrance: StopEntrance

    var imageName: String {
        switch entrance.entranceType {
        case .Elevator:
            return "door.sliding.right.hand.closed"
        default:
            return "figure.stairs.circle"
        }
    }

    var body: some View {
        ZStack {
            // Background layer
            RoundedRectangle(cornerRadius: 10)
                .fill(.ultraThickMaterial)
                .frame(width: 40, height: 40)
                .shadow(radius: 5)
            VStack {
                /*
                 "figure.stairs"
                 "figure.stairs.circle"
                 "figure.stairs.circle.fill"

                 figure.walk.departure
                 figure.walk.arrival

                 figure.run
                 figure.run.circle

                 door.sliding.right.hand.closed
                 */
                
                Image(systemName: imageName)//"figure.run.circle")
                    .resizable()
                    .frame(width: 20, height: 20)
                    .foregroundColor(.green)
            }
        }
    }

    //@State var stop: Stop
    //ForEach(stop.entrances ?? [], id: \.id) { entrance in
    //}
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
        .presentationDetents([.fraction(0.40), .medium, .large])  //, selection: selectedDetent)
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
