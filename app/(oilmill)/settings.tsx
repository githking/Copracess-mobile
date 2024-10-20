import React from "react";
import SettingsPage from "../../components/SettingsPage";
import { Stack } from "expo-router";

const Settings = () => {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SettingsPage />
    </>
  );
};

export default Settings;
