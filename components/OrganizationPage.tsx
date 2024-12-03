import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { icons } from "../constants";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Dimensions } from "react-native";

const { width: screenWidth } = Dimensions.get("window");

interface OrganizationData {
  id: string;
  name: string;
  address: string;
  geolocation: {
    latitude: number;
    longitude: number;
  } | null;
  isVerified: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  position: string | null;
  image: string | null;
  isActive: boolean;
}

interface ApiResponse {
  organization: OrganizationData;
  users: User[];
}
const MiniMap: React.FC<{
  latitude: number;
  longitude: number;
  name: string;
}> = ({ latitude, longitude, name }) => {
  return (
    <View className="h-48 rounded-lg overflow-hidden">
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        zoomEnabled={false}
        scrollEnabled={false}
        rotateEnabled={false}
      >
        <Marker coordinate={{ latitude, longitude }} title={name}>
          <View className="bg-primary p-2 rounded-lg shadow-md">
            <MaterialCommunityIcons name="store" size={24} color="#FFFFFF" />
          </View>
        </Marker>
      </MapView>
    </View>
  );
};
const OrganizationPage = () => {
  const router = useRouter();
  const { authState } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [organizationData, setOrganizationData] =
    useState<OrganizationData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState<OrganizationData | null>(
    null
  );
  const params = useLocalSearchParams();

  const toggleEdit = () => {
    if (isEditing) {
      Alert.alert(
        "Discard Changes",
        "Are you sure you want to discard your changes?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => {
              setOrganizationData(originalData);
              setIsEditing(false);
            },
          },
        ]
      );
    } else {
      setIsEditing(true);
    }
  };

  useEffect(() => {
    if (params.latitude && params.longitude) {
      setOrganizationData((prev) =>
        prev
          ? {
              ...prev,
              geolocation: {
                ...prev.geolocation,
                latitude: Number(params.latitude),
                longitude: Number(params.longitude),
              },
            }
          : prev
      );
    }
  }, [params.latitude, params.longitude, params.timestamp]);

  useEffect(() => {
    fetchOrgDetails();
  }, []);
  const fetchOrgDetails = async () => {
    if (!authState?.data.organizationId) {
      setError("No organization ID found");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get<ApiResponse>(
        `/organizations?id=${authState.data.organizationId}`
      );

      if (response.data) {
        setOriginalData(response.data.organization);
        setOrganizationData(response.data.organization);
        setError(null);
      }
    } catch (error: any) {
      console.error("Error fetching organization details:", error);
      setError(
        error.response?.data?.error || "Failed to load organization details"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateField = (
    field: keyof Pick<OrganizationData, "name" | "address">,
    value: string
  ) => {
    if (organizationData) {
      setOrganizationData({
        ...organizationData,
        [field]: value,
      });
    }
  };

  // In OrganizationPage, update handleSaveChanges to include the new coordinates
  const handleSaveChanges = async () => {
    if (!organizationData?.name || !organizationData.address) {
      Alert.alert("Error", "Organization name and address are required");
      return;
    }

    setIsSaving(true);
    try {
      const updateData = {
        name: organizationData.name,
        address: organizationData.address,
        latitude: organizationData.geolocation?.latitude,
        longitude: organizationData.geolocation?.longitude,
      };

      // All changes including location are saved only when clicking "SAVE CHANGES"
      await axios.put(
        `/organizations?id=${authState?.data.organizationId}`,
        updateData
      );
      Alert.alert("Success", "Organization details updated successfully");

      // Update originalData after successful save
      setOriginalData(organizationData);
      setIsEditing(false);
    } catch (error: any) {
      console.error("Error updating organization:", error);
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to update organization details"
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-off-100">
        <ActivityIndicator size="large" color="#59A60E" />
      </View>
    );
  }

  if (!organizationData) {
    return (
      <View className="flex-1 justify-center items-center bg-off-100">
        <Text className="text-red-500">
          {error || "Failed to load organization data"}
        </Text>
      </View>
    );
  }
  const handleBack = () => {
    router.replace("/settings"); // Navigate to settings instead of going back
  };
  return (
    <ScrollView className="flex-1 bg-off-100">
      <View className="px-4 py-2 mt-14">
        <View className="flex-row justify-between items-center mb-6">
          <TouchableOpacity onPress={handleBack}>
            <FontAwesome5 name="arrow-left" size={30} color="#59A60E" />
          </TouchableOpacity>
          <Text className="text-2xl font-pbold text-primary">ORGANIZATION</Text>
          <TouchableOpacity onPress={toggleEdit}>
            <FontAwesome5
              name={isEditing ? "times" : "edit"}
              size={24}
              color="#59A60E"
            />
          </TouchableOpacity>
        </View>

        <View className="items-center mb-6">
          <Text className="text-lg font-psemibold">
            {organizationData.name}
          </Text>
          {organizationData.isVerified && (
            <View className="flex-row items-center mt-1">
              <FontAwesome5 name="check-circle" size={16} color="#59A60E" />
              <Text className="ml-2 text-primary">Verified</Text>
            </View>
          )}
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-sm font-psemibold mb-1">
              Organization Name
            </Text>
            <TextInput
              className="border border-primary rounded-md p-2 bg-white"
              placeholder="Enter organization name"
              value={organizationData.name}
              onChangeText={(text) => handleUpdateField("name", text)}
              editable={isEditing}
              style={!isEditing ? { color: "#666" } : undefined}
            />
          </View>

          <View>
            <Text className="text-sm font-psemibold mb-1">Address</Text>
            <View className="relative">
              <TextInput
                className="border border-primary rounded-md p-2 pr-10 bg-white"
                placeholder="Enter organization address"
                value={organizationData.address}
                onChangeText={(text) => handleUpdateField("address", text)}
                multiline
                editable={isEditing}
                style={!isEditing ? { color: "#666" } : undefined}
              />

              <TouchableOpacity
                className="absolute right-2 top-2"
                onPress={() => console.log("Open map picker")}
              >
                <Image
                  source={icons.location}
                  className="w-6 h-6"
                  tintColor="#59A60E"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Display geolocation if available */}
          {organizationData.geolocation && (
            <View className="mt-4">
              <Text className="text-sm font-psemibold mb-2">Location Map</Text>
              <TouchableOpacity
                onPress={() =>
                  isEditing &&
                  router.push({
                    pathname: "/(others)/editorg",
                    params: {
                      // Add null checks with optional chaining and default values
                      latitude: organizationData.geolocation?.latitude ?? 0,
                      longitude: organizationData.geolocation?.longitude ?? 0,
                    },
                  })
                }
                activeOpacity={isEditing ? 0.7 : 1}
              >
                {/* Add null check before passing props to MiniMap */}
                {organizationData.geolocation && (
                  <MiniMap
                    key={`${organizationData.geolocation.latitude}-${organizationData.geolocation.longitude}`}
                    latitude={organizationData.geolocation.latitude}
                    longitude={organizationData.geolocation.longitude}
                    name={organizationData.name}
                  />
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {isEditing && (
          <TouchableOpacity
            className={`bg-primary rounded-md py-3 mt-6 mb-6 ${
              isSaving ? "opacity-50" : ""
            }`}
            onPress={handleSaveChanges}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-psemibold text-center">
                SAVE CHANGES
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

export default OrganizationPage;
