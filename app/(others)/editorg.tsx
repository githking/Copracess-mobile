import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import * as Location from "expo-location";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

const DEFAULT_LOCATION = {
  latitude: 12.8797,
  longitude: 121.774,
};

const DEFAULT_DELTA = {
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

const EditOrgLocation = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const mapRef = useRef<MapView>(null);
  const { authState } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);

  const [selectedLocation, setSelectedLocation] = useState<LocationCoordinates>(
    {
      latitude: Number(params.latitude) || DEFAULT_LOCATION.latitude,
      longitude: Number(params.longitude) || DEFAULT_LOCATION.longitude,
    }
  );

  const [userLocation, setUserLocation] = useState<LocationCoordinates | null>(
    null
  );
  const [isTrackingLocation, setIsTrackingLocation] = useState(false);

  useEffect(() => {
    initializeMapAndLocation();
  }, []);

  const initializeMapAndLocation = async () => {
    setIsLoading(true);
    try {
      // Animate map to initial organization location
      mapRef.current?.animateToRegion(
        {
          ...selectedLocation,
          ...DEFAULT_DELTA,
        },
        1000
      );

      // Get user location permissions and position
      await getCurrentLocation();
    } catch (error) {
      console.error("Error initializing map:", error);
      setLocationError("Failed to initialize map location");
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    setIsTrackingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Location permission is needed to show your current location on the map.",
          [{ text: "OK" }]
        );
        return;
      }

      // Get location with high accuracy
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setLocationError(null);
    } catch (error) {
      console.error("Error getting location:", error);
      setLocationError("Failed to get current location");
      Alert.alert(
        "Location Error",
        "Unable to get your current location. Please check your device settings.",
        [{ text: "OK" }]
      );
    } finally {
      setIsTrackingLocation(false);
    }
  };

  const handleLocationPress = () => {
    if (!userLocation) {
      getCurrentLocation();
      return;
    }

    mapRef.current?.animateToRegion(
      {
        ...userLocation,
        ...DEFAULT_DELTA,
      },
      1000
    );
  };

  const handleMapPress = (event: any) => {
    const { coordinate } = event.nativeEvent;
    setSelectedLocation(coordinate);

    // Animate to the new location
    mapRef.current?.animateToRegion(
      {
        ...coordinate,
        ...DEFAULT_DELTA,
      },
      500
    );
  };

  const handleSave = async () => {
    if (selectedLocation) {
      try {
        // Get the latest organization data to include required fields
        const orgResponse = await axios.get(
          `/organizations?id=${authState?.data.organizationId}`,
          {
            headers: {
              Authorization: `Bearer ${authState?.accessToken}`,
            },
          }
        );

        const currentOrgData = orgResponse.data.organization;

        // First save to API with all required fields
        await axios.put(
          `/organizations?id=${authState?.data.organizationId}`,
          {
            name: currentOrgData.name,
            address: currentOrgData.address,
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
          },
          {
            headers: {
              Authorization: `Bearer ${authState?.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Then navigate back with new params
        router.replace({
          pathname: "/(settings)/organization",
          params: {
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
            timestamp: Date.now(),
          },
        });

        Alert.alert("Success", "Location updated successfully");
      } catch (error: any) {
        console.error("Error updating location:", error);
        Alert.alert(
          "Error",
          error.response?.data?.error || "Failed to update location"
        );
      }
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <GestureHandlerRootView style={styles.container}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.iconBtn}
            >
              <FontAwesome5 name="arrow-left" size={24} color="#59A60E" />
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#59A60E" />
            </View>
          ) : (
            <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              onPress={handleMapPress}
              initialRegion={{
                ...selectedLocation,
                ...DEFAULT_DELTA,
              }}
              showsUserLocation
              showsMyLocationButton={false}
            >
              {selectedLocation && (
                <Marker
                  coordinate={selectedLocation}
                  draggable
                  onDragEnd={(e) =>
                    setSelectedLocation(e.nativeEvent.coordinate)
                  }
                >
                  <View style={styles.markerContainer}></View>
                </Marker>
              )}
            </MapView>
          )}

          <TouchableOpacity
            style={[
              styles.locationButton,
              isTrackingLocation && styles.buttonDisabled,
            ]}
            onPress={handleLocationPress}
            disabled={isTrackingLocation}
          >
            {isTrackingLocation ? (
              <ActivityIndicator size="small" color="#59A60E" />
            ) : (
              <MaterialCommunityIcons
                name="crosshairs-gps"
                size={24}
                color="#59A60E"
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <FontAwesome5 name="check" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </GestureHandlerRootView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  header: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 1,
  },
  iconBtn: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  locationButton: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  map: {
    width: screenWidth,
    height: screenHeight,
  },
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  saveButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#59A60E",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default EditOrgLocation;
