import React, { useState } from "react";
import { View, Text } from "react-native";

import { Ionicons } from "@expo/vector-icons";

const TruckSection = () => {
  const trucks = [
    {
      id: 1,
      plateNumber: "ABC123",
      destination: "JTP Commercial",
      departure: "04/12/24",
      status: "on Queue",
      weight: "7 tons",
    },
    {
      id: 2,
      plateNumber: "ABC123",
      destination: "JTP Commercial",
      departure: "04/12/24",
      status: "on Queue",
      weight: "7 tons",
    },
    {
      id: 3,
      plateNumber: "ABC123",
      destination: "JTP Commercial",
      departure: "04/12/24",
      status: "on Queue",
      weight: "7 tons",
    },
  ];

  return (
    <View className="mt-4">
      <View className="flex-row items-center mb-2">
        <Text className="text-2xl font-bold mr-2">TRUCKS</Text>
        <Ionicons name="car-outline" size={24} color="black" />
      </View>
      <View className="bg-gray-200 p-2 rounded-lg">
        <View className="flex-row justify-between mb-2">
          <Text className="font-semibold">PLATE NUMBER</Text>
          <Text className="font-semibold">DESTINATION</Text>
          <Text className="font-semibold">DEPARTURE</Text>
          <Text className="font-semibold">STATUS</Text>
          <Text className="font-semibold">WEIGHT</Text>
        </View>
        {trucks.map((truck) => (
          <View key={truck.id} className="flex-row justify-between mb-1">
            <Text>{truck.plateNumber}</Text>
            <Text>{truck.destination}</Text>
            <Text>{truck.departure}</Text>
            <Text>{truck.status}</Text>
            <Text>{truck.weight}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default TruckSection;
