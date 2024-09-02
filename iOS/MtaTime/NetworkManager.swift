//
//  ServiceManager.swift
//  MtaTime
//
//  Created by James Wegner on 7/14/24.
//

import Foundation
import SwiftProtobuf

enum FeedType {
    case lTrain
}

final class ServiceManager {
    
    public static let sharedInstance = ServiceManager()

    private init() {}

    public func fetchFeed(_ feedType: FeedType) async {
        let apiURL: URL?

        switch feedType {
        case .lTrain:
            apiURL = URL(string: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-l")
        }

        guard let apiURL else {
            print("Invalid apiURL")
            return
        }

        let request = URLRequest(url: apiURL)
        let data = try? await URLSession.shared.data(for: request)

        //URLSession.shared.dataTask(with: apiURL).resume()

       /* let task = URLSession.shared.dataTask(with: url) {(data, response, error) in
            guard let data = data else { return }
            print(String(data: data, encoding: .utf8)!)
        }

        task.resume()*/
    }
}
