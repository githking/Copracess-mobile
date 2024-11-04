import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import type { VirtualQueueHeaderProps } from "../types/type";

const VirtualQueueHeader: React.FC<VirtualQueueHeaderProps> = ({
  queueNumber,
  currentlyUnloading,
  totalTrucks,
  completed,
  onTheWay,
}) => {
  return (
    <View className="bg-primary rounded-lg p-3 mb-2">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-white text-xs font-psemibold uppercase">
          Virtual Queue #{queueNumber}
        </Text>
        <TouchableOpacity className="bg-white rounded-xl p-1">
          <Text className="text-primary text-xs font-pregular">
            VIEW QR CODE
          </Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row items-center">
        <View className="flex-1 border-r border-white/20">
          <Text className="text-white/80 text-[10px] uppercase font-pmedium">
            Currently Unloading
          </Text>
          <Text className="text-white text-base font-pbold mt-1">
            #{currentlyUnloading}
          </Text>
        </View>

        <View className="flex-1 border-r border-white/20 pl-3">
          <Text className="text-white/80 text-[10px] uppercase font-pmedium">
            Total Trucks
          </Text>
          <Text className="text-white text-base font-pbold mt-1">
            {totalTrucks}
          </Text>
        </View>

        <View className="flex-1 border-r border-white/20 pl-3">
          <Text className="text-white/80 text-[10px] uppercase font-pmedium">
            Completed
          </Text>
          <Text className="text-white text-base font-pbold mt-1">
            {completed}
          </Text>
        </View>

        <View className="flex-1 pl-3">
          <Text className="text-white/80 text-[10px] uppercase font-pmedium">
            On The Way
          </Text>
          <Text className="text-white text-base font-pbold mt-1">
            {onTheWay}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default VirtualQueueHeader;
