import { View, Text } from "react-native";
import React from "react";
import { Link } from "expo-router";

export default function App() {
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-2xl font-pbold">Copracess</Text>
      <Link href="/home">Go to Home</Link>
      <Link href="/signIn">Go to SignIn</Link>
      <Link href="/signUp">Go to SignUp</Link>
    </View>
  );
}
