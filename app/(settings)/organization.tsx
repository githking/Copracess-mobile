// app/(settings)/organization.tsx

import React from "react";
import { Stack } from "expo-router";
import OrganizationPage from "../../components/OrganizationPage";

const Organization = () => {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <OrganizationPage />
    </>
  );
};

export default Organization;
