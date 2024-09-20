import {
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { useState } from "react";
import CheckBox from "react-native-check-box";
import { FontAwesome } from "@expo/vector-icons"; // Import icons from FontAwesome

import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";

const signIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const submit = () => {
    // Handle submit logic
  };

  return (
    <SafeAreaView className="bg-off-100 h-full">
      <ScrollView>
        <View
          className="w-full justify-center 
        h-full px-4 my-6"
        >
          <View className="flex-row justify-start mb-2">
            <Image
              source={images.logo}
              resizeMode="contain"
              className="w-[350px] h-[70px]"
            />
          </View>
          <View className="flex-row items-center mt-5">
            <Text className="text-xl text-bold font-psemibold">
              Sign in as Copra Buyer
            </Text>
            <TouchableOpacity className="ml-6">
              <Text className="text-primary ml-4">Change User</Text>
            </TouchableOpacity>
          </View>
          <FormField
            title="Email Address"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-3"
            keyboardType="email-address"
            placeholder="Enter your email address"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            placeholder="Enter password"
          />
          <View className="flex-row items-center justify-between mt-3">
            <View className="flex-row items-center">
              <CheckBox
                isChecked={rememberMe}
                onClick={() => setRememberMe(!rememberMe)}
                checkBoxColor="#59A60E"
                uncheckedCheckBoxColor="#080807"
              />
              <Text className="ml-2">Remember Me</Text>
            </View>
            <TouchableOpacity>
              <Text className="text-primary">Forgot Password?</Text>
            </TouchableOpacity>
          </View>
          <CustomButton
            title="Log In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
          <Text className="text-center mt-5">or log in with</Text>
          <View className="flex-row justify-between mt-5">
            <TouchableOpacity className="border-2 border-primary bg-white flex-1 items-center mr-2 p-2 bg-blue-600 rounded">
              <FontAwesome name="facebook" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity className="border-2 border-primary bg-white flex-1 items-center ml-2 p-2 bg-red-600 rounded">
              <FontAwesome name="google" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-center items-center mt-5">
            <Text>Don't have an account?</Text>
            <TouchableOpacity>
              <Text className="text-primary ml-2">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default signIn;
