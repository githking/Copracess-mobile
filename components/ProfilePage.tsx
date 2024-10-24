import React from "react";
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

const ProfilePage = () => {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-off-100">
      <View className="px-4 py-2 mt-14">
        <View className="flex-row justify-between items-center mb-6">
          <TouchableOpacity onPress={() => router.back()}>
            <FontAwesome5 name="arrow-left" size={30} color="#59A60E" />
          </TouchableOpacity>
          <Text className="text-2xl font-pbold text-primary">PROFILE</Text>
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
            <Text className="text-sm font-psemibold mb-1">Username</Text>
            <TextInput
              className="border border-primary rounded-md p-2 bg-white"
              placeholder="Username"
            />
          </View>

          <View className="flex-row space-x-2">
            <View className="flex-1">
              <Text className="text-sm font-psemibold mb-1">First Name</Text>
              <TextInput
                className="border border-primary rounded-md p-2 bg-white"
                placeholder="First Name"
              />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-psemibold mb-1">Middle name</Text>
              <TextInput
                className="border border-primary rounded-md p-2 bg-white"
                placeholder="Middle Name"
              />
            </View>
          </View>

          <View>
            <Text className="text-sm font-psemibold mb-1">Last Name</Text>
            <TextInput
              className="border border-primary rounded-md p-2 bg-white"
              placeholder="Last Name"
            />
          </View>

          <View>
            <Text className="text-sm font-psemibold mb-1">Email</Text>
            <TextInput
              className="border border-primary rounded-md p-2 bg-white"
              placeholder="Email"
              keyboardType="email-address"
            />
          </View>

          <View>
            <Text className="text-sm font-psemibold mb-1">Phone number</Text>
            <TextInput
              className="border border-primary rounded-md p-2 bg-white"
              placeholder="63+"
              keyboardType="phone-pad"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfilePage;
