//
//  ContentView.swift
//  MtaTime
//
//  Created by James Wegner on 7/14/24.
//

import Foundation
import SwiftUI
import UIKit

struct TrainSquare: View {
    let color: Color
    let title: String

    var body: some View {
        ZStack {
            RoundedRectangle(cornerSize: CGSize(width: 15, height: 15))
                .fill(color)
                .frame(minWidth: 100, maxWidth: 100, minHeight: 100, maxHeight:100)
                .clipShape(Circle())
            Text(title)
                .foregroundStyle(Color.white)
                .font(.title2)
                .fontWeight(.bold)
        }
    }
}

struct ContentView: View {
    let columns = [GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible())]

    var body: some View {
        VStack {
            ZStack {
                RoundedRectangle(cornerSize: CGSize(width: 15, height: 15))
                    .fill(Color(Constants.mtaColor))
                    .frame(maxHeight:100)
                HStack {
                    Image(systemName: "tram.fill")
                        .font(.title)
                        .foregroundStyle(Color.white)
                        .padding(8)
                    Text("MTA Times")
                        .foregroundStyle(Color.white)
                        .font(.largeTitle)
                        .fontWeight(.bold)
                }
            }
            .padding()
            LazyVGrid(columns: columns, content: {
                TrainSquare(color: Color(Constants.aceColor), title: "A C E")
                TrainSquare(color: Color(Constants.bdfmColor), title: "B D F M")
                TrainSquare(color: Color(Constants.gColor), title: "G")
                TrainSquare(color: Color(Constants.jzColor), title: "J Z")
                TrainSquare(color: Color(Constants.lColor), title: "L")
                TrainSquare(color: Color(Constants.nqrColor), title: "N Q R")
                TrainSquare(color: Color(Constants.sColor), title: "S")
                TrainSquare(color: Color(Constants.oneTwoThreeColor), title: "1 2 3")
                TrainSquare(color: Color(Constants.fourFiveSixColor), title: "4 5 6")
                TrainSquare(color: Color(Constants.sevenColor), title: "7")
            })
            Spacer()
        }
    }
}

#Preview {
    ContentView()
}
