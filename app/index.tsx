import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Link, Redirect, Stack } from "expo-router";
import SplashScreen from "../components/SplashScreen";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { useAuth } from "@clerk/clerk-expo";

const MainContent = () => (
  <View className="flex-1 justify-center items-center">
    <Text className="text-2xl font-pbold">Copracess</Text>
    <Link href="/(copraowner)/home">
      <Text className="text-blue-500">Go to Copra Owner Home</Text>
    </Link>
    <Link href="/(oilmill)/home">
      <Text className="text-blue-500">Go to Oilmill Home</Text>
    </Link>
    <Link href="/signIn">
      <Text className="text-blue-500">Go to SignIn</Text>
    </Link>
    <Link href="/signUp">
      <Text className="text-blue-500">Go to SignUp</Text>
    </Link>
  </View>
);

export default function App() {
  const { isSignedIn } = useAuth();
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isSignedIn) {
    return <Redirect href={"/(copraowner)/home"} />;
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      {isSplashVisible ? (
        <SplashScreen onFinish={() => setIsSplashVisible(false)} />
      ) : (
        <MainContent />
      )}
    </>
  );
}
