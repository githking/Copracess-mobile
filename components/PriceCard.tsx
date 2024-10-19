import React from "react";
import { View, Text } from "react-native";
import type { PriceCardProps } from "../types/type";

const PriceCard: React.FC<PriceCardProps> = ({ title, price, subtitle }) => (
  <View className="bg-white rounded-lg shadow-sm p-4 mb-2 flex-1 mr-2 border border-primary">
    <Text className="text-gray-600 text-xs mb-1 font-pbold">{title}</Text>
    <Text className="text-primary text-xl font-pbold mb-1">₱{price}</Text>
    {subtitle && (
      <Text className="text-gray-500 text-xs font-pregular">{subtitle}</Text>
    )}
  </View>
);

export default PriceCard;
