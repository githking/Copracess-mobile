import {
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { useCallback, useState } from "react";
import CheckBox from "react-native-check-box";
import { FontAwesome } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { images } from "@/constants";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";

import { SignInForm } from "@/types/type";
import { useAuth } from "@/context/AuthContext";

const App = () => {
  const router = useRouter();
  const [form, setForm] = useState<SignInForm>({
    email: "",
    password: "",
  });
  const { onLogin } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const submit = useCallback(async () => {
    setIsSubmitting(true);

    const result = await onLogin!(form.email, form.password);
    if (result && result.error) {
      alert(result.msg);
    }

    setIsSubmitting(false);
  }, [form]);

  return (
    <SafeAreaView className="bg-off-100 h-full">
      <ScrollView>
        <View
          className="w-full justify-center 
        h-full px-4 my-6"
        >
          <View className="flex-row justify-start mb-2 mt-10">
            <Image
              source={images.logo}
              resizeMode="contain"
              className="w-[350px] h-[70px]"
            />
          </View>
          <View className="flex-row items-center mt-5">
            <Text className="text-xl text-bold font-pbold">Log in</Text>
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
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-[1px] bg-gray-100" />
            <Text className="mx-4 text-gray-100 font-pmedium">
              or Continue with
            </Text>
            <View className="flex-1 h-[1px] bg-gray-100" />
          </View>

          <View className="space-y-4">
            <TouchableOpacity className="w-full bg-white border border-gray-100 rounded-lg py-3 flex-row justify-center items-center">
              <FontAwesome name="google" size={20} color="#DB4437" />
              <Text className="font-pmedium ml-2">Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity className="w-full bg-white border border-gray-100 rounded-lg py-3 flex-row justify-center items-center">
              <FontAwesome name="facebook" size={20} color="#4267B2" />
              <Text className="font-pmedium ml-2">Continue with Facebook</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-center items-center mt-5">
            <Text>Don't have an account?</Text>
            <Link className="text-primary ml-2" href="/roleSelect">
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
