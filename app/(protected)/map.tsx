import React, { useEffect, useState, useRef, useCallback } from "react";
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
import { calculateDistance } from "@/lib/distanceCalculator";

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
  updatedAt: string; // Add this
  permit: string | null;
  isVerified: boolean;
  geolocationId: string | null; // Add this
  creatorId: string; // Add this
  geolocation: Geolocation;
  price: Price[];
  distance?: number;
}

interface LocationData {
  coords: {
    latitude: number;
    longitude: number;
  };
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const PHILIPPINES_BOUNDS = {
  latitudeDelta: 16.5,
  longitudeDelta: 14,
  latitude: 12.8797,
  longitude: 121.774,
};

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

      // Update oil mills with distance when location is available
      if (oilMills.length > 0) {
        const millsWithDistance = oilMills.map((mill) => ({
          ...mill,
          distance: calculateDistance(
            location.coords.latitude,
            location.coords.longitude,
            mill.geolocation.latitude,
            mill.geolocation.longitude
          ),
        }));
        setFilteredMills(millsWithDistance);
      }
    })();
  }, [oilMills]);

  useEffect(() => {
    const fetchOilMills = async () => {
      try {
        const response = await axios.get("/map");
        console.log("API Response:", response.data.organizations[0]); // Debug first item
        if (response.data && Array.isArray(response.data.organizations)) {
          setOilMills(response.data.organizations);
        }
      } catch (error) {
        console.error("Error fetching oil mills:", error);
      }
    };

    if (authState?.accessToken) {
      fetchOilMills();
    }
  }, [authState?.accessToken]);

  const handleSearch = useCallback(
    (text: string) => {
      setSearchQuery(text);

      if (!text.trim()) {
        setFilteredMills(oilMills);
        return;
      }

      const filtered = oilMills.filter(
        (mill) =>
          mill.name.toLowerCase().includes(text.toLowerCase()) ||
          mill.address.toLowerCase().includes(text.toLowerCase())
      );

      setFilteredMills(filtered);

      if (filtered.length > 0 && !isListView && mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: filtered[0].geolocation.latitude,
          longitude: filtered[0].geolocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    },
    [oilMills, isListView]
  );

  const handleMarkerPress = useCallback((mill: Organization) => {
    setSelectedMill(mill);
    setIsBottomSheetVisible(true);

    if (mill.geolocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: mill.geolocation.latitude,
        longitude: mill.geolocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, []);

  const handleCloseBottomSheet = useCallback(() => {
    setIsBottomSheetVisible(false);
    setSelectedMill(null);
  }, []);

  const handleOrganizationSelect = useCallback((organization: Organization) => {
    if (organization.geolocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: organization.geolocation.latitude,
        longitude: organization.geolocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, []);

  const CustomMarker = useCallback(
    ({
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
        >
          <MaterialCommunityIcons
            name="store"
            size={35}
            color={isSelected ? "#FFFFFF" : "#59A60E"}
          />
          <Text
            className={`text-[10px] font-pbold ${
              isSelected ? "text-white" : "text-primary"
            }`}
          >
            {name}
          </Text>
          {price && (
            <Text
              className={`text-[10px] font-pbold ${
                isSelected ? "text-white" : "text-primary"
              }`}
            >
              ₱{price.toFixed(2)}
            </Text>
          )}
        </View>
      </View>
    ),
    []
  );

  const renderMarker = useCallback(
    (mill: Organization) => {
      const isSelected = selectedMill?.id === mill.id;
      const latestPrice = mill.price?.[0]?.price; // Get latest price

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
          <CustomMarker
            isSelected={isSelected}
            name={mill.name}
            price={latestPrice}
          />
        </Marker>
      );
    },
    [selectedMill, handleMarkerPress, CustomMarker]
  );

  if (isListView) {
    return (
      <ListView
        oilMills={filteredMills}
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
          initialRegion={PHILIPPINES_BOUNDS}
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

        <OrganizationBottomSheet
          visible={isBottomSheetVisible}
          organizations={selectedMill ? [selectedMill] : []}
          onOrganizationSelect={handleOrganizationSelect}
          onClose={handleCloseBottomSheet}
        />
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
    width: 50,
    height: 50,
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

export default MapScreen;
