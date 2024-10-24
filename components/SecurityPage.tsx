import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const SecurityPage = () => {
  const router = useRouter();
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const handleUpdateField = (
    field: keyof typeof securityData,
    value: string
  ) => {
    setSecurityData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleNotifications = () => {
    setIsNotificationsEnabled((previousState) => !previousState);
  };

  return (
    <ScrollView className="flex-1 bg-off-100">
      <View className="px-4 py-2 mt-14">
        <View className="flex-row justify-between items-center mb-6">
          <TouchableOpacity onPress={() => router.back()}>
            <FontAwesome5 name="arrow-left" size={30} color="#59A60E" />
          </TouchableOpacity>
          <Text className="text-2xl font-pbold text-primary">SECURITY</Text>
          <TouchableOpacity>
            <FontAwesome5 name="edit" size={24} color="#59A60E" />
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-between items-center mb-6 border-b border-gray-200 pb-4">
          <Text className="text-lg font-psemibold">Notifications</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#59A60E" }}
            thumbColor="#ffffff"
            ios_backgroundColor="#767577"
            onValueChange={toggleNotifications}
            value={isNotificationsEnabled}
          />
        </View>

        <Text className="text-lg font-psemibold mb-4">Change Password</Text>

        <View className="space-y-4">
          <View>
            <Text className="text-sm font-pregular mb-1">Current Password</Text>
            <TextInput
              className="border border-primary rounded-md p-3 bg-white"
              placeholder="••••••••"
              value={securityData.currentPassword}
              onChangeText={(text) =>
                handleUpdateField("currentPassword", text)
              }
              secureTextEntry
            />
          </View>

          <View>
            <Text className="text-sm font-pregular mb-1">New Password</Text>
            <TextInput
              className="border border-primary rounded-md p-3 bg-white"
              placeholder="••••••••"
              value={securityData.newPassword}
              onChangeText={(text) => handleUpdateField("newPassword", text)}
              secureTextEntry
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default SecurityPage;
