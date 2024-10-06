import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const AuthLayout = () => {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="signIn" />
        <Stack.Screen name="signUp" />
      </Stack>
      <StatusBar backgroundColor="#E5E5E5" style="light" />
    </>
  );
};

export default AuthLayout;
