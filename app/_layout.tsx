import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { useFonts } from "expo-font";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import SplashScreenComponent from "../components/SplashScreen";

const StackLayout = () => {
  const { authState } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    console.log("authState : ", authState);

    const inAuthGroup = segments[0] === "(protected)";
    console.log(inAuthGroup);

    if (!authState?.authenticated) {
      router.navigate("/");
    } else if (authState?.authenticated === true) {
      router.navigate("/(protected)/home");
    }
  }, [authState]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(protected)" options={{ headerShown: false }} />
    </Stack>
  );
};

const rootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    if (error) {
      throw error;
    }
    if (fontsLoaded) {
      // Set app ready after a timeout to simulate loading
      setTimeout(() => {
        SplashScreen.hideAsync();
        setIsAppReady(true);
      }, 1000);
    }
  }, [fontsLoaded, error]);

  // Determine if the splash screen should still be shown
  const isSplashVisible = !fontsLoaded || !isAppReady;

  return isSplashVisible ? (
    <SplashScreenComponent
      onFinish={() => setIsAppReady(true)} // Adjust if needed
      isFontsLoaded={fontsLoaded}
      isAppReady={isAppReady}
    />
  ) : (
    <AuthProvider>
      <StackLayout />
    </AuthProvider>
  );
};

export default rootLayout;

const styles = StyleSheet.create({});
