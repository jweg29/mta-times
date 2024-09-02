//
//  Item.swift
//  MtaTime
//
//  Created by James Wegner on 7/14/24.
//

import Foundation
import SwiftData

@Model
final class Item {
    var timestamp: Date
    
    init(timestamp: Date) {
        self.timestamp = timestamp
    }
}
