// app/(settings)/profile.tsx

import React from "react";
import { Stack } from "expo-router";
import ProfilePage from "../../components/ProfilePage";

const Profile = () => {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ProfilePage />
    </>
  );
};

export default Profile;
