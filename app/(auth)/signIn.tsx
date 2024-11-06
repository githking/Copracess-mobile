import {
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  View,
  Text,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useCallback, useState, useEffect } from "react";
import CheckBox from "react-native-check-box";
import { FontAwesome } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { images } from "@/constants";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import * as SecureStore from "expo-secure-store";

import { SignInForm } from "@/types/type";
import { useAuth } from "@/context/AuthContext";

const REMEMBER_ME_KEY = "auth.remember_me";
const REMEMBERED_EMAIL_KEY = "auth.remembered_email";

const SignIn = () => {
  const router = useRouter();
  const { onLogin, authState } = useAuth();

  const [form, setForm] = useState<SignInForm>({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Load remembered email if exists
  useEffect(() => {
    const loadRememberedEmail = async () => {
      try {
        const [rememberedEmail, isRememberMe] = await Promise.all([
          SecureStore.getItemAsync(REMEMBERED_EMAIL_KEY),
          SecureStore.getItemAsync(REMEMBER_ME_KEY),
        ]);

        if (rememberedEmail && isRememberMe === "true") {
          setForm((prev) => ({ ...prev, email: rememberedEmail }));
          setRememberMe(true);
        }
      } catch (error) {
        console.error("Error loading remembered email:", error);
      }
    };

    loadRememberedEmail();
  }, []);

  const handleRememberMe = async (value: boolean) => {
    setRememberMe(value);
    try {
      await SecureStore.setItemAsync(REMEMBER_ME_KEY, value.toString());
      if (!value) {
        await SecureStore.deleteItemAsync(REMEMBERED_EMAIL_KEY);
      }
    } catch (error) {
      console.error("Error saving remember me preference:", error);
    }
  };

  const validateForm = () => {
    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      return false;
    }
    if (!form.email.includes("@")) {
      setError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const submit = useCallback(async () => {
    try {
      setError(null);
      if (!validateForm()) return;

      setIsSubmitting(true);

      const result = await onLogin!(form.email, form.password);

      if (result.error) {
        setError(result.msg);
        Alert.alert("Error", result.msg);
        return;
      }

      // If remember me is checked, save the email
      if (rememberMe) {
        await SecureStore.setItemAsync(REMEMBERED_EMAIL_KEY, form.email);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again.");
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [form, rememberMe]);

  // Disable the form while authentication is in progress
  const isFormDisabled: boolean = isSubmitting || !!authState?.authenticated;

  return (
    <SafeAreaView className="bg-off-100 h-full">
      <ScrollView>
        <View className="w-full justify-center h-full px-4 my-6">
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

          {error && (
            <Text className="text-red-500 mt-2 font-pmedium">{error}</Text>
          )}

          <FormField
            title="Email Address"
            value={form.email}
            handleChangeText={(e) => {
              setError(null);
              setForm({ ...form, email: e });
            }}
            otherStyles="mt-3"
            keyboardType="email-address"
            placeholder="Enter your email address"
            editable={!isFormDisabled}
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => {
              setError(null);
              setForm({ ...form, password: e });
            }}
            otherStyles="mt-7"
            placeholder="Enter password"
            editable={!isFormDisabled}
          />

          <View className="flex-row items-center justify-between mt-3">
            <View className="flex-row items-center">
              <CheckBox
                isChecked={rememberMe}
                onClick={() => handleRememberMe(!rememberMe)}
                checkBoxColor="#59A60E"
                uncheckedCheckBoxColor="#080807"
                disabled={isFormDisabled}
              />
              <Text className="ml-2">Remember Me</Text>
            </View>
            <TouchableOpacity
              disabled={isFormDisabled}
              onPress={() => {
                Alert.alert(
                  "Coming Soon",
                  "Forgot password functionality will be available soon."
                );
              }}
            >
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
            <TouchableOpacity
              className="w-full bg-white border border-gray-100 rounded-lg py-3 flex-row justify-center items-center"
              disabled={isFormDisabled}
              onPress={() => {
                Alert.alert(
                  "Coming Soon",
                  "Google sign in will be available soon."
                );
              }}
            >
              <FontAwesome name="google" size={20} color="#DB4437" />
              <Text className="font-pmedium ml-2">Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-full bg-white border border-gray-100 rounded-lg py-3 flex-row justify-center items-center"
              disabled={isFormDisabled}
              onPress={() => {
                Alert.alert(
                  "Coming Soon",
                  "Facebook sign in will be available soon."
                );
              }}
            >
              <FontAwesome name="facebook" size={20} color="#4267B2" />
              <Text className="font-pmedium ml-2">Continue with Facebook</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center items-center mt-5">
            <Text>Don't have an account?</Text>
            <Link
              href="/(auth)/roleSelect"
              className="text-primary ml-2"
              disabled={isFormDisabled}
            >
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
