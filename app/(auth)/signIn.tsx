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
import {
  checkClerkUserExists,
  checkEmailExists,
} from "../../utils/actions/checkEmail";
import { SignInForm } from "../../types/type";
import { loginClerk, signupClerk } from "../../utils/actions/auth";

const signIn = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { signUp } = useSignUp();
  const router = useRouter();
  const { client } = useClerk();

  const [form, setForm] = useState<SignInForm>({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const submit = useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    setIsSubmitting(true);

    try {
      const user = await checkEmailExists(form.email, form.password);

      if (!user) {
        console.error("Invalid credentials. User not found in API.");
        setIsSubmitting(false);
        return;
      }

      const clerkUser = await checkClerkUserExists(form.email);

      if (clerkUser) {
        await loginClerk(signIn, setActive, form, user, router);
      } else {
        await signupClerk(signUp, setActive, form, user, router);
      }
    } catch (error) {
      console.error("An error occurred during the submit process:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [isLoaded, form, signIn, setActive, signupClerk, loginClerk, router]);

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
