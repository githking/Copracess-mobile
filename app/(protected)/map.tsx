import React, { useState } from "react";
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MillCard from "@/components/MillCard";
import ListView from "@/components/MapListView";
import { images } from "@/constants";
import type { Mill } from "@/types/type";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const oilMills: Mill[] = [
  {
    id: "1",
    name: "Central Oil Mill",
    location: "Al Hiteen Street, Block 3",
    contact: "+1 234-567-8901",
    distance: "0.8 km",
    image: "https://example.com/mill1.jpg",
    rating: 4.5,
    status: "Open",
    operatingHours: "8:00 AM - 6:00 PM",
  },
  {
    id: "2",
    name: "Golden Press Mills",
    location: "Al Jamaeya District",
    contact: "+1 234-567-8902",
    distance: "1.2 km",
    image: "https://example.com/mill2.jpg",
    rating: 4.2,
    status: "Open",
    operatingHours: "9:00 AM - 7:00 PM",
  },
  {
    id: "3",
    name: "Premium Oil Co.",
    location: "Industrial Area",
    contact: "+1 234-567-8903",
    distance: "2.5 km",
    image: "https://example.com/mill3.jpg",
    rating: 4.8,
    status: "Closed",
    operatingHours: "8:00 AM - 5:00 PM",
  },
];

const MapScreen = () => {
  const [isListView, setIsListView] = useState(false);

  const handleBookPress = (millId: string) => {
    console.log("Booking mill:", millId);
    // Implement booking logic here
  };

  if (isListView) {
    return (
      <ListView oilMills={oilMills} onSwitchView={() => setIsListView(false)} />
    );
  }

  return (
    <View className="flex-1">
      {/* Map container with dynamic dimensions */}
      <View
        className="absolute inset-0"
        style={{ width: screenWidth, height: screenHeight }}
      >
        <Image
          source={images.maps}
          className="absolute inset-0"
          style={{
            width: screenWidth,
            height: screenHeight,
          }}
          resizeMode="cover"
        />
      </View>

      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row justify-between items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg mx-4 mt-2">
          <View className="flex-1">
            <Text className="text-2xl font-pbold text-black">Oil Mills</Text>
          </View>
          <TouchableOpacity
            onPress={() => setIsListView(true)}
            className="bg-white p-2 rounded-md shadow-sm"
          >
            <Text className="text-primary font-pmedium">List View</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom floating cards */}
        <View className="absolute bottom-8 left-0 right-0">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-4"
          >
            {oilMills.map((mill) => (
              <MillCard
                key={mill.id}
                mill={mill}
                onBookPress={handleBookPress}
                variant="map"
              />
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default MapScreen;
