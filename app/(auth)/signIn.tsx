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
import { useSignIn, useSignUp, useClerk } from "@clerk/clerk-expo";

import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import axios from "axios";
import { checkEmailExists } from "../../utils/actions/checkEmail";

const signIn = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { signUp } = useSignUp();
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const submit = useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    const user = await checkEmailExists(form.email, form.password);

    if (!user) {
      console.error("Invalid credentials.");
      setIsSubmitting(false);
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        if (user.role === "COPRA_BUYER") {
          router.replace("/(copraowner)/home");
        } else if (
          user.role === "OIL_MILL_MANAGER" ||
          user.role === "OIL_MILL_MEMBER"
        ) {
          router.replace("/(oilmill)/home");
        }
      } else {
        console.error(
          "Sign-in not complete:",
          JSON.stringify(signInAttempt, null, 2)
        );
      }
    } catch (err: any) {
      console.error("Error during sign-in:", JSON.stringify(err, null, 2));
    } finally {
      setIsSubmitting(false);
    }
  }, [isLoaded, form]);

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
          <Text className="text-center mt-5">or Log in with</Text>
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
            <Link className="text-primary ml-2" href="/signUp">
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default signIn;
