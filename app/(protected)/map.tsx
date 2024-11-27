import React, { useEffect, useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  Alert,
  StyleSheet,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import ListView from "@/components/MapListView";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import * as Location from "expo-location";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import OrganizationBottomSheet from "@/components/BottomSheet";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Interfaces
interface ListViewMill {
  id: string;
  name: string;
  location: string;
  contact: string;
  distance: string;
  image: string;
  rating: number;
  status: "Open" | "Closed";
  operatingHours: string;
}

interface Geolocation {
  id: string;
  latitude: number;
  longitude: number;
}

interface Price {
  id: string;
  price: number;
  market_price: number;
  date: string;
  organizationId: string;
}

interface Organization {
  id: string;
  name: string;
  address: string;
  accessCode: string;
  createdAt: string;
  updatedAt: string;
  permit: string | null;
  isVerified: boolean;
  geolocationId: string | null;
  creatorId: string;
  geolocation: Geolocation;
  price: Price[];
}

interface LocationData {
  coords: {
    latitude: number;
    longitude: number;
  };
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const MapScreen = () => {
  const { authState } = useAuth();
  const mapRef = useRef<MapView>(null);
  const [isListView, setIsListView] = useState(false);
  const [selectedMill, setSelectedMill] = useState<Organization | null>(null);
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);
  const [oilMills, setOilMills] = useState<Organization[]>([]);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMills, setFilteredMills] = useState<Organization[]>([]);

  const initialRegion = {
    latitude: 14.5995,
    longitude: 120.9842,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      setUserLocation(location as LocationData);
    })();
  }, []);

  useEffect(() => {
    const fetchOilMills = async () => {
      try {
        if (!authState?.accessToken) return;

        const response = await axios.get("/map", {
          headers: {
            Authorization: `Bearer ${authState.accessToken}`,
          },
        });

        if (response.data && Array.isArray(response.data.organizations)) {
          setOilMills(response.data.organizations);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("Error fetching oil mills:", error);
        Alert.alert("Error", "Failed to fetch oil mills");
      }
    };

    if (authState?.accessToken) {
      fetchOilMills();
    }
  }, [authState?.accessToken]);

  const CustomMarker = ({
    isSelected,
    name,
    price,
  }: {
    isSelected: boolean;
    name: string;
    price?: number;
  }) => (
    <View>
      <View
        className={`items-center justify-center ${
          isSelected ? "bg-primary" : "bg-white"
        }`}
        style={styles.markerContainer}
      >
        <MaterialCommunityIcons
          name="store"
          size={20}
          color={isSelected ? "#FFFFFF" : "#59A60E"}
        />
        <Text
          className={`text-[10px] font-pbold ${
            isSelected ? "text-white" : "text-primary"
          }`}
          numberOfLines={1}
        >
          {name}
        </Text>
        {price && (
          <Text
            className={`text-[9px] ${
              isSelected ? "text-white" : "text-primary"
            }`}
          >
            ₱{price.toFixed(2)}
          </Text>
        )}
      </View>
      <View
        className={`w-2 h-2 rotate-45 ${
          isSelected ? "bg-primary" : "bg-white"
        } self-center -mt-1`}
        style={styles.markerArrow}
      />
    </View>
  );
  // Update the search handler function
  const handleSearch = (text: string) => {
    setSearchQuery(text);

    if (!text.trim()) {
      setFilteredMills(oilMills); // Show all mills when search is empty
      return;
    }

    // Filter mills based on search query
    const filtered = oilMills.filter(
      (mill) =>
        mill.name.toLowerCase().includes(text.toLowerCase()) ||
        mill.address.toLowerCase().includes(text.toLowerCase())
    );

    setFilteredMills(filtered);

    // If there are filtered results and we're in map view, animate to the first result
    if (filtered.length > 0 && !isListView && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: filtered[0].geolocation.latitude,
        longitude: filtered[0].geolocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };
  useEffect(() => {
    setFilteredMills(oilMills);
  }, [oilMills]);

  const handleMarkerPress = (mill: Organization) => {
    setSelectedMill(mill);
    setIsBottomSheetVisible(true);

    // Animate to selected marker
    if (mill.geolocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: mill.geolocation.latitude,
        longitude: mill.geolocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  const handleCloseBottomSheet = () => {
    setIsBottomSheetVisible(false);
    setSelectedMill(null);
  };

  const handleOrganizationSelect = (organization: Organization) => {
    if (organization.geolocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: organization.geolocation.latitude,
        longitude: organization.geolocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  const transformToListViewMills = (orgs: Organization[]): ListViewMill[] => {
    return orgs.map((org) => ({
      id: org.id,
      name: org.name,
      location: org.address,
      contact: "N/A",
      distance: "N/A",
      image: "",
      rating: 0,
      status: "Open" as const,
      operatingHours: "9:00 AM - 5:00 PM",
    }));
  };

  const renderMarker = (mill: Organization) => {
    const isSelected = selectedMill?.id === mill.id;
    const latestPrice =
      mill.price && mill.price.length > 0
        ? mill.price.reduce((latest, current) =>
            new Date(current.date) > new Date(latest.date) ? current : latest
          )
        : null;

    return (
      <Marker
        key={mill.id}
        coordinate={{
          latitude: mill.geolocation.latitude,
          longitude: mill.geolocation.longitude,
        }}
        onPress={() => handleMarkerPress(mill)}
        tracksViewChanges={false}
      >
        <CustomMarker isSelected={isSelected} name={mill.name} />
      </Marker>
    );
  };

  if (isListView) {
    return (
      <ListView
        oilMills={transformToListViewMills(filteredMills)}
        onSwitchView={() => setIsListView(false)}
      />
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1">
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={{ width: screenWidth, height: screenHeight }}
          initialRegion={initialRegion}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {userLocation && (
            <Marker
              coordinate={{
                latitude: userLocation.coords.latitude,
                longitude: userLocation.coords.longitude,
              }}
              title="Your Location"
            >
              <View className="bg-blue-500 p-2 rounded-full">
                <MaterialCommunityIcons
                  name="map-marker-account"
                  size={24}
                  color="#FFFFFF"
                />
              </View>
            </Marker>
          )}
          {Array.isArray(filteredMills) && filteredMills.map(renderMarker)}
        </MapView>

        <SafeAreaView className="flex-1 absolute top-0 left-0 right-0">
          <View className="flex-row items-center space-x-2 px-4 py-2 mx-4 mt-2">
            {/* Search Bar */}
            <View className="flex-1 flex-row items-center bg-white rounded-lg px-3 py-2 shadow-sm">
              <MaterialCommunityIcons
                name="magnify"
                size={20}
                color="#9CA3AF"
              />
              <TextInput
                placeholder="Search oil mills..."
                value={searchQuery}
                onChangeText={handleSearch}
                className="flex-1 ml-2 text-base font-pregular text-gray-800"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* List View Toggle Button */}
            <TouchableOpacity
              onPress={() => setIsListView(true)}
              className="bg-white p-2 rounded-lg shadow-sm"
            >
              <MaterialCommunityIcons
                name="view-list"
                size={24}
                color="#59A60E"
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {isBottomSheetVisible && selectedMill && (
          <OrganizationBottomSheet
            organizations={[selectedMill]}
            onOrganizationSelect={handleOrganizationSelect}
            onClose={handleCloseBottomSheet}
          />
        )}
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: 50, // Fixed width
    height: 50, // Fixed height
    borderRadius: 8,
    padding: 4,
  },
  markerArrow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

const mapStyle = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "transit",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [
      {
        color: "#f5f5f5",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#e9e9e9",
      },
    ],
  },
];

export default MapScreen;
