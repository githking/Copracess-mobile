import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { images } from "@/constants";
import FormField from "@/components/FormField";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import CustomButton from "@/components/CustomButton";

const buyerSignUp = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "COPRA_BUYER",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    setErrorMessage("");
    if (!form.name || !form.email || !form.password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post("/register", form);
      Alert.alert(
        "Success",
        "Registration successful! Please check your email for activation."
      );
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage("Registration failed. Please try again.");
      Alert.alert("Error", "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
              value={form.name}
              handleChangeText={(e) => setForm({ ...form, name: e })}
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

          <CustomButton
            title="Register"
            handlePress={handleSubmit}
            containerStyles="py-4 mb-6"
            isLoading={isSubmitting}
          />

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
