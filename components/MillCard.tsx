import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import type { Mill, MillCardProps } from "../types/type";
import { images } from "../constants";

const MillCard: React.FC<MillCardProps> = ({ mill, onBookPress, variant }) => {
  if (variant === "map") {
    return (
      <View className="bg-white rounded-xl p-4 mr-3 shadow-lg w-72">
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="text-black font-psemibold text-lg">
              {mill.name}
            </Text>
            <Text className="text-gray-100 font-pregular text-sm mt-1">
              {mill.location}
            </Text>
            <View className="flex-row items-center mt-2">
              <View
                className={`h-2 w-2 rounded-full ${
                  mill.status === "Open" ? "bg-primary" : "bg-gray-100"
                } mr-2`}
              />
              <Text
                className={`text-sm font-pmedium ${
                  mill.status === "Open" ? "text-primary" : "text-gray-100"
                }`}
              >
                {mill.status}
              </Text>
              <Text className="text-primary font-pmedium text-sm ml-4">
                {mill.distance}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          className="bg-primary py-2 px-4 rounded-md mt-4"
          onPress={() => onBookPress?.(mill.id)}
        >
          <Text className="text-white font-pmedium text-center">Book Now</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="bg-white rounded-xl mb-4 shadow-sm overflow-hidden">
      <Image
        source={images.oilmill}
        className="w-full h-48"
        resizeMode="cover"
      />
      <View className="p-4">
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="text-black font-psemibold text-xl">
              {mill.name}
            </Text>
            <Text className="text-gray-100 font-pregular text-sm mt-1">
              {mill.location}
            </Text>
            <Text className="text-gray-100 font-pregular text-sm mt-1">
              {mill.contact}
            </Text>

            <View className="flex-row items-center mt-3">
              <View
                className={`h-2 w-2 rounded-full ${
                  mill.status === "Open" ? "bg-primary" : "bg-gray-100"
                } mr-2`}
              />
              <Text
                className={`text-sm font-pmedium ${
                  mill.status === "Open" ? "text-primary" : "text-gray-100"
                }`}
              >
                {mill.status}
              </Text>
              <Text className="text-gray-100 font-pregular text-sm ml-4">
                {mill.operatingHours}
              </Text>
            </View>

            <View className="flex-row items-center justify-between mt-3">
              <Text className="text-primary font-pmedium text-sm">
                {mill.distance}
              </Text>
              <TouchableOpacity
                className="bg-primary py-2 px-6 rounded-md"
                onPress={() => onBookPress?.(mill.id)}
              >
                <Text className="text-white font-pmedium">Book Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default MillCard;
