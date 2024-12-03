import { Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="signIn" />
      <Stack.Screen name="roleSelect" />
      <Stack.Screen name="oilsignUp" />
      <Stack.Screen name="buyersignUp" />
    </Stack>
  );
}
