import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { icons } from "../constants";

const OrganizationPage = () => {
  const router = useRouter();
  const [organizationData, setOrganizationData] = useState({
    companyName: "",
    position: "",
    address: "",
  });

  const handleUpdateField = (
    field: keyof typeof organizationData,
    value: string
  ) => {
    setOrganizationData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <ScrollView className="flex-1 bg-off-100">
      <View className="px-4 py-2 mt-14">
        <View className="flex-row justify-between items-center mb-6">
          <TouchableOpacity onPress={() => router.back()}>
            <FontAwesome5 name="arrow-left" size={30} color="#59A60E" />
          </TouchableOpacity>
          <Text className="text-2xl font-pbold text-primary">ORGANIZATION</Text>
          <TouchableOpacity>
            <FontAwesome5 name="edit" size={24} color="#59A60E" />
          </TouchableOpacity>
        </View>

        <View className="items-center mb-6">
          <View className="w-24 h-24 bg-primary rounded-full justify-center items-center mb-2">
            <Image
              source={icons.profile}
              className="w-14 h-14"
              tintColor="white"
            />
          </View>
          <Text className="text-lg font-psemibold">Name</Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-sm font-psemibold mb-1">Company Name</Text>
            <TextInput
              className="border border-primary rounded-md p-2 bg-white"
              placeholder="JTP Commercial"
              value={organizationData.companyName}
              onChangeText={(text) => handleUpdateField("companyName", text)}
            />
          </View>

          <View>
            <Text className="text-sm font-psemibold mb-1">Position</Text>
            <TextInput
              className="border border-primary rounded-md p-2 bg-white"
              placeholder="Secretary"
              value={organizationData.position}
              onChangeText={(text) => handleUpdateField("position", text)}
            />
          </View>

          <View>
            <Text className="text-sm font-psemibold mb-1">Address</Text>
            <View className="relative">
              <TextInput
                className="border border-primary rounded-md p-2 pr-10 bg-white"
                placeholder="Brgy Talipan, Pagbilao Quezon"
                value={organizationData.address}
                onChangeText={(text) => handleUpdateField("address", text)}
                multiline
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

          <TouchableOpacity className="bg-primary rounded-md py-3 mt-6">
            <Text className="text-white font-psemibold text-center">
              SAVE CHANGES
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default OrganizationPage;
