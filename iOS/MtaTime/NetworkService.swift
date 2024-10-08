//
//  NetworkError.swift
//  MtaTime
//
//  Created by James Wegner on 10/7/24.
//


//
//  NetworkService.swift
//  MapListSheet
//
//  Created by James Wegner on 8/22/24.
//

import Combine
import Foundation

enum NetworkError: LocalizedError {
    case invalidURL

    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "Invalid URL"
        }
    }
}

enum Endpoint {
    case fetchStops
    case fetchDepartures

    var url: URL? {
        switch self {
        case .fetchStops:
            URL(string: "https://mta-times.vercel.app/api/stops")
        case .fetchDepartures:
            URL(string: "")
        }
    }
}

public final class NetworkService: NSObject {

    public static let shared = NetworkService()
    private var cancellables = Set<AnyCancellable>()

    private override init() { }

    /*func fetchFood() -> AnyPublisher<[Food], Error>   {
        guard let url = Endpoint.fetchFood.url else {
            print("Invalid URL")
            return Fail(error: NetworkError.invalidURL).eraseToAnyPublisher()
        }

        return URLSession.shared.dataTaskPublisher(for: url)
            .map {
                $0.data
            }
            .decode(type: [Food].self, decoder: JSONDecoder())
            .receive(on: DispatchQueue.main)
            .eraseToAnyPublisher()
    }*/
}
