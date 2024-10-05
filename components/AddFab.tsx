import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

import type { addFABProps } from "../types/type";

const AddFab: React.FC<addFABProps> = ({ onPress }) => {
  return (
    <TouchableOpacity className="absolute bottom-4 right-4" onPress={onPress}>
      <View className="w-14 h-14 rounded-full bg-[#59A60E] items-center justify-center shadow-lg">
        <Text className="text-white text-2xl font-bold">+</Text>
      </View>
    </TouchableOpacity>
  );
};

export default AddFab;
