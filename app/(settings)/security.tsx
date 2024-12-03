// app/(settings)/security.tsx

import React from "react";
import { Stack } from "expo-router";
import SecurityPage from "../../components/SecurityPage";

const Security = () => {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SecurityPage />
    </>
  );
};

export default Security;
