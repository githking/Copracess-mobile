// components/SummaryCard.tsx
import React from "react";
import { View, Text } from "react-native";
import type { SummaryCardProps } from "../types/type";

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  items,
  titleClassName = "",
  containerClassName = "",
}) => {
  return (
    <View className={`bg-primary rounded-lg p-3 ${containerClassName}`}>
      <Text
        className={`text-white text-xs font-psemibold mb-2 ${titleClassName}`}
      >
        {title}
      </Text>
      <View className="flex-row items-center">
        {items.map((item, index) => (
          <View
            key={index}
            className={`flex-1 ${
              index !== items.length - 1 ? "border-r border-white/20" : ""
            }`}
          >
            <View className={`${index !== 0 ? "pl-3" : ""}`}>
              <Text className="text-white/80 text-[10px] uppercase font-pmedium">
                {item.label}
              </Text>
              <Text className="text-white text-base font-pbold mt-1">
                {item.unit && item.unit === "₱" ? `${item.unit} ` : ""}
                {typeof item.value === "number"
                  ? item.value.toLocaleString()
                  : item.value}
                {item.unit && item.unit !== "₱" ? ` ${item.unit}` : ""}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default SummaryCard;
