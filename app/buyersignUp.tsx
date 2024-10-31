import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { images } from "@/constants";
import FormField from "@/components/FormField";
import { FontAwesome } from "@expo/vector-icons";

const buyerSignUp = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleSubmit = () => {
    console.log("Form submitted:", form);
  };

  return (
    <SafeAreaView className="bg-off-100 h-full">
      <ScrollView className="flex-grow-1">
        <View className="w-full justify-center h-full px-4 py-2">
          <View className="flex-row items-center mb-2 mt-10">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <FontAwesome name="angle-left" size={30} color="#59A60E" />
            </TouchableOpacity>
            <Image
              source={images.logo}
              resizeMode="contain"
              className="w-[300px] h-[70px]"
            />
          </View>

          <Text className="text-xl text-bold font-psemibold mb-6">
            Create Copra Buyer Account
          </Text>

          <View className="items-center mb-6">
            <FormField
              title="Full name"
              value={form.fullName}
              handleChangeText={(e) => setForm({ ...form, fullName: e })}
              otherStyles="mb-4"
              keyboardType="default"
              placeholder="Enter your name"
            />

            <FormField
              title="Email Address"
              value={form.email}
              handleChangeText={(e) => setForm({ ...form, email: e })}
              otherStyles="mb-4"
              keyboardType="email-address"
              placeholder="Enter email address"
            />

            <FormField
              title="Password"
              value={form.password}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              otherStyles="mb-4"
              placeholder="Enter password"
            />
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-primary rounded-lg py-4 mb-6"
          >
            <Text className="text-white font-psemibold text-center">
              Register
            </Text>
          </TouchableOpacity>

          <View className="flex-row items-center mb-6">
            <View className="flex-1 h-[1px] bg-gray-100" />
            <Text className="mx-4 text-gray-100 font-pmedium">
              or Continue with
            </Text>
            <View className="flex-1 h-[1px] bg-gray-100" />
          </View>

          <View className="space-y-4 mb-6">
            <TouchableOpacity className="w-full bg-white border border-gray-100 rounded-lg py-3 flex-row justify-center items-center">
              <FontAwesome
                name="google"
                size={20}
                color="#DB4437"
                className="mr-2"
              />
              <Text className="font-pmedium ml-2">Google</Text>
            </TouchableOpacity>

            <TouchableOpacity className="w-full bg-white border border-gray-100 rounded-lg py-3 flex-row justify-center items-center">
              <FontAwesome
                name="facebook"
                size={20}
                color="#4267B2"
                className="mr-2"
              />
              <Text className="font-pmedium ml-2">Facebook</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center items-center mb-10">
            <Text className="font-pregular">Already Have an Account?</Text>
            <Link className="text-primary ml-2 font-pmedium" href="/signIn">
              Login
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default buyerSignUp;
