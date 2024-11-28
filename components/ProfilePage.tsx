import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
  Switch,
  ActivityIndicator,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import axios from "axios";

interface ProfileData {
  name: string;
  email: string;
  image: string;
  isTwoFactorEnabled: boolean;
}

interface AuthState {
  accessToken: string;
  data: {
    name: string;
    email: string;
    image: string;
    isTwoFactorEnabled: boolean;
  };
}

interface ProfilePageProps {
  authState: AuthState;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ authState }) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<ProfileData>({
    name: authState?.data.name || "",
    email: authState?.data.email || "",
    image: authState?.data.image || "",
    isTwoFactorEnabled: authState?.data.isTwoFactorEnabled || false,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ProfileData, string>>
  >({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProfileData, string>> = {};

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const pickImage = useCallback(async () => {
    try {
      setIsImageLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets[0].uri) {
        setFormData((prev) => ({
          ...prev,
          image: result.assets[0].uri,
        }));
      }
    } catch (error) {
      Alert.alert("Error", "Failed to select image");
      console.error("Image picker error:", error);
    } finally {
      setIsImageLoading(false);
    }
  }, []);

  const handleUpdateField = useCallback(
    <K extends keyof ProfileData>(field: K, value: ProfileData[K]) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Clear error when field is updated
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }
    },
    [errors]
  );

  const handleSaveChanges = async () => {
    if (!validateForm()) return;

    if (!authState?.accessToken) {
      Alert.alert("Error", "Not authenticated");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.put("/user", formData, {
        headers: {
          Authorization: `Bearer ${authState.accessToken}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      });

      if (response.data.requiresOTP) {
        Alert.alert(
          "Email Verification Required",
          "Please check your email for a verification code"
        );
      } else {
        Alert.alert("Success", "Profile updated successfully");
        setIsEditing(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error ||
          error.response?.data?.details?.[0]?.message ||
          "Failed to update profile";

        Alert.alert("Error", errorMessage);
      } else {
        Alert.alert("Error", "An unexpected error occurred");
      }
      console.error("Profile update error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-off-100">
      <View className="px-4 py-2 mt-14">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <TouchableOpacity onPress={() => router.back()}>
            <FontAwesome5 name="arrow-left" size={30} color="#59A60E" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsEditing(!isEditing)}
            disabled={isSubmitting}
          >
            <FontAwesome5
              name={isEditing ? "times" : "edit"}
              size={24}
              color={isSubmitting ? "#ccc" : "#59A60E"}
            />
          </TouchableOpacity>
        </View>

        {/* Profile Image */}
        <View className="items-center mb-6">
          <TouchableOpacity
            onPress={isEditing ? pickImage : undefined}
            disabled={isSubmitting || isImageLoading}
            className="w-24 h-24 bg-primary rounded-full justify-center items-center mb-2"
          >
            {isImageLoading ? (
              <ActivityIndicator color="white" />
            ) : formData.image ? (
              <Image
                source={{ uri: formData.image }}
                className="w-24 h-24 rounded-full"
              />
            ) : (
              <FontAwesome5 name="user" size={40} color="white" />
            )}
            {isEditing && !isImageLoading && (
              <View className="absolute bottom-0 right-0 bg-primary p-2 rounded-full">
                <FontAwesome5 name="camera" size={14} color="white" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View className="space-y-4">
          <View>
            <Text className="text-sm font-semibold mb-1">Name</Text>
            <TextInput
              className={`border ${
                errors.name ? "border-red-500" : "border-primary"
              } 
                rounded-md p-2 bg-white ${!isEditing ? "opacity-50" : ""}`}
              value={formData.name}
              onChangeText={(text) => handleUpdateField("name", text)}
              editable={isEditing && !isSubmitting}
              placeholder="Enter your name"
            />
            {errors.name && (
              <Text className="text-red-500 text-xs mt-1">{errors.name}</Text>
            )}
          </View>

          <View>
            <Text className="text-sm font-semibold mb-1">Email</Text>
            <TextInput
              className="border border-primary rounded-md p-2 bg-white opacity-50"
              value={formData.email}
              editable={false}
            />
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="text-sm font-semibold">
              Two-Factor Authentication
            </Text>
            <Switch
              value={formData.isTwoFactorEnabled}
              onValueChange={(value) =>
                handleUpdateField("isTwoFactorEnabled", value)
              }
              disabled={!isEditing || isSubmitting}
            />
          </View>
        </View>

        {/* Action Button */}
        {isEditing && (
          <TouchableOpacity
            className={`bg-primary rounded-md py-3 mt-6 ${
              isSubmitting ? "opacity-50" : ""
            }`}
            onPress={handleSaveChanges}
            disabled={isSubmitting}
          >
            <Text className="text-white font-semibold text-center">
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

export default ProfilePage;
