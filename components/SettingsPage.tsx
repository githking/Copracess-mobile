import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { icons } from "../constants";
import LogoutModal from "./LogoutModal";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";

const SettingsPage = () => {
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const router = useRouter();
  const { onLogout } = useAuth();

  const handleLogoutPress = () => {
    setIsLogoutModalVisible(true);
  };

  const handleLogoutCancel = () => {
    setIsLogoutModalVisible(false);
  };

  const handleLogoutConfirm = async () => {
    console.log("Logging out...");
    if (onLogout) {
      try {
        setIsLogoutModalVisible(false);
        await onLogout();

        router.replace("/signIn");
      } catch (error) {
        console.error("Error signing out:", error);
      }
    } else {
      console.error("Logout function is not defined!");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-off-100">
      <View className="px-6 pt-2 flex-1">
        <View className="items-center">
          <Text className="text-3xl font-pbold text-primary mb-2">
            SETTINGS
          </Text>
        </View>
        <View className="items-center mb-4">
          <View className="w-24 h-24 bg-primary rounded-full justify-center items-center mb-1">
            <Image
              source={icons.profile}
              className="w-14 h-14"
              tintColor="white"
            />
          </View>
          <Text className="text-lg font-psemibold">Name</Text>
        </View>

        <TouchableOpacity
          className="bg-white flex-row items-center justify-between py-3 border border-primary rounded-md mb-2 px-4"
          onPress={() => router.push("/profile")}
        >
          <View className="flex-row items-center">
            <FontAwesome
              name="user"
              size={20}
              color="#59A60E"
              style={{ marginRight: 10 }}
            />
            <Text className="text-lg font-pregular">Profile</Text>
          </View>
          <FontAwesome name="angle-right" size={24} color="#59A60E" />
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white flex-row items-center justify-between py-3 border border-primary rounded-md mb-2 px-4"
          onPress={() => router.push("/organization")}
        >
          <View className="flex-row items-center">
            <FontAwesome
              name="building"
              size={20}
              color="#59A60E"
              style={{ marginRight: 10 }}
            />
            <Text className="text-lg font-pregular">Organization</Text>
          </View>
          <FontAwesome name="angle-right" size={24} color="#59A60E" />
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white flex-row items-center justify-between py-3 border border-primary rounded-md mb-2 px-4"
          onPress={() => router.push("/security")}
        >
          <View className="flex-row items-center">
            <FontAwesome
              name="lock"
              size={20}
              color="#59A60E"
              style={{ marginRight: 10 }}
            />
            <Text className="text-lg font-pregular">Security</Text>
          </View>
          <FontAwesome name="angle-right" size={24} color="#59A60E" />
        </TouchableOpacity>

        <View className="flex-1" />
        <View className="w-full items-end mb-6">
          <TouchableOpacity
            className="bg-primary py-3 rounded-md w-1/2"
            onPress={handleLogoutPress}
          >
            <Text className="text-white text-center font-psemibold">
              LOG OUT
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <LogoutModal
        isVisible={isLogoutModalVisible}
        onCancel={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </SafeAreaView>
  );
};

export default SettingsPage;
