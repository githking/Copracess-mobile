import React from "react";
import { View, ActivityIndicator, Text } from "react-native";

interface LoadingProps {
  variant?: "fullscreen" | "inline";
  message?: string;
  size?: "small" | "large";
  color?: string;
}

const Loading: React.FC<LoadingProps> = ({
  variant = "inline",
  message = "Loading...",
  size = "large",
  color = "#59A60E",
}) => {
  if (variant === "fullscreen") {
    return (
      <View className="flex-1 bg-off-100 justify-center items-center">
        <ActivityIndicator size={size} color={color} />
        {message && (
          <Text className="mt-4 text-gray-100 font-pmedium text-base">
            {message}
          </Text>
        )}
      </View>
    );
  }

  return (
    <View className="flex-row justify-center items-center py-4">
      <ActivityIndicator size={size} color={color} />
      {message && (
        <Text className="ml-2 text-gray-100 font-pmedium">{message}</Text>
      )}
    </View>
  );
};

export default Loading;
