import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { icons } from "@/constants";

const SecurityPage = () => {
  const router = useRouter();
  const { authState } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  // Add visibility state for each password field
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleUpdateField = (
    field: keyof typeof securityData,
    value: string
  ) => {
    setSecurityData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveChanges = async () => {
    if (!validateForm()) return;
    if (!authState?.accessToken || !authState?.data?.id) {
      Alert.alert("Error", "Authentication token not found");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        userId: authState.data.id,
        currentPassword: securityData.currentPassword,
        newPassword: securityData.newPassword,
      };

      const response = await axios.post("/change-password", payload, {
        headers: {
          Authorization: `Bearer ${authState.accessToken}`,
        },
      });

      Alert.alert("Success", "Password updated successfully");
      router.back();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Alert.alert(
          "Error",
          error.response?.data?.error || "Failed to update password"
        );
      } else {
        Alert.alert("Error", "An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = () => {
    if (!securityData.currentPassword) {
      Alert.alert("Error", "Current password is required");
      return false;
    }
    if (!securityData.newPassword) {
      Alert.alert("Error", "New password is required");
      return false;
    }
    if (securityData.newPassword.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return false;
    }
    return true;
  };

  return (
    <ScrollView className="flex-1 bg-off-100">
      <View className="px-4 py-2 mt-14">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <TouchableOpacity onPress={() => router.back()}>
            <FontAwesome5 name="arrow-left" size={30} color="#59A60E" />
          </TouchableOpacity>
          <Text className="text-2xl font-pbold text-primary">SECURITY</Text>
          <View style={{ width: 30 }} />
        </View>

        {/* Form Fields */}
        <View className="space-y-4">
          <View>
            <Text className="text-sm font-semibold mb-1">Current Password</Text>
            <View className="relative flex-row items-center">
              <TextInput
                className="border border-primary rounded-md p-3 bg-white flex-1 pr-12"
                placeholder="Enter current password"
                value={securityData.currentPassword}
                onChangeText={(text) =>
                  handleUpdateField("currentPassword", text)
                }
                secureTextEntry={!showCurrentPassword}
              />
              <TouchableOpacity
                className="absolute right-3"
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                <Image
                  source={showCurrentPassword ? icons.eye : icons.eyeHide}
                  className="w-6 h-6"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <Text className="text-sm font-semibold mb-1">New Password</Text>
            <View className="relative flex-row items-center">
              <TextInput
                className="border border-primary rounded-md p-3 bg-white flex-1 pr-12"
                placeholder="Enter new password (min. 8 characters)"
                value={securityData.newPassword}
                onChangeText={(text) => handleUpdateField("newPassword", text)}
                secureTextEntry={!showNewPassword}
              />
              <TouchableOpacity
                className="absolute right-3"
                onPress={() => setShowNewPassword(!showNewPassword)}
              >
                <Image
                  source={showNewPassword ? icons.eye : icons.eyeHide}
                  className="w-6 h-6"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Save Button */}
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
      </View>
    </ScrollView>
  );
};

export default SecurityPage;
