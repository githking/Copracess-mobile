import { StyleSheet, Text, View } from "react-native";
import React from "react";

import type { GoogleInputProps } from "../types/type";

const GoogleTextInput = ({
  icon,
  containerStyles,
  initialLocation,
  handlePress,
  textInputBackgroundColor,
}: GoogleInputProps) => {
  return (
    <View
      className={`flex flex-row items-center justify-center relative 
    z-50 rounded-xl ${containerStyles} mb-5`}
    >
      <Text>Search</Text>
    </View>
  );
};

export default GoogleTextInput;

const styles = StyleSheet.create({});
