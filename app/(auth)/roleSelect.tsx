// app/(auth)/roleSelect.tsx
import { View, Text, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, Link } from "expo-router";
import { useState } from "react";
import { images } from "@/constants";
import { FontAwesome } from "@expo/vector-icons";

const RoleSelection = () => {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<"mill" | "buyer" | null>(
    null
  );

  const handleContinue = () => {
    if (selectedRole === "mill") {
      router.push("/oilsignUp");
    } else if (selectedRole === "buyer") {
      router.push("/buyersignUp");
    }
  };

  return (
    <SafeAreaView className="bg-off-100 h-full">
      <View className="w-full justify-center h-full px-4 py-2">
        <View className="flex-row justify-start mb-2 mt-10">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[350px] h-[70px]"
          />
        </View>

        <Text className="text-2xl font-pbold text-center mb-6">
          Choose Your Role
        </Text>

        <View className="space-y-6">
          <TouchableOpacity
            className={`bg-white p-4 rounded-xl border-2 relative ${
              selectedRole === "mill"
                ? "border-primary shadow-lg"
                : "border-gray-100"
            }`}
            onPress={() => setSelectedRole("mill")}
          >
            {selectedRole === "mill" && (
              <View className="absolute top-2 right-2 z-10 bg-primary rounded-full p-2">
                <FontAwesome name="check" size={24} color="white" />
              </View>
            )}
            <View className="items-center justify-center h-48">
              <Image
                source={images.selectmill}
                className="w-full h-full"
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className={`bg-white p-4 rounded-xl border-2 relative ${
              selectedRole === "buyer"
                ? "border-primary shadow-lg"
                : "border-gray-100"
            }`}
            onPress={() => setSelectedRole("buyer")}
          >
            {selectedRole === "buyer" && (
              <View className="absolute top-2 right-2 z-10 bg-primary rounded-full p-2">
                <FontAwesome name="check" size={24} color="white" />
              </View>
            )}
            <View className="items-center justify-center h-48">
              <Image
                source={images.selectbuyer}
                className="w-full h-full"
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>
        </View>

        <View className="mt-8 space-y-2">
          <TouchableOpacity
            className={`bg-primary py-4 rounded-xl ${
              !selectedRole ? "opacity-50" : "opacity-100"
            }`}
            onPress={handleContinue}
            disabled={!selectedRole}
          >
            <Text className="text-white text-center font-pbold text-lg">
              Continue
            </Text>
          </TouchableOpacity>

          <Link href="/signIn" asChild>
            <TouchableOpacity className="py-3">
              <Text className="text-center font-pmedium text-black">
                Back to Login
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RoleSelection;
