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
    <View className="bg-primary rounded-lg p-4 mb-4">
      <View className="flex-row justify-between items-start mb-2">
        <View>
          <Text className="text-white font-pbold text-lg">VIRTUAL QUEUE</Text>
          <Text className="text-white font-pbold text-lg">#{queueNumber}</Text>
        </View>
        <TouchableOpacity>
          <Text className="text-white font-pmedium text-xs">VIEW QR CODE</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row justify-between mt-2">
        <View className="border-r border-white pr-2 flex-1">
          <Text className="text-white font-pmedium text-xs">CURRENTLY</Text>
          <Text className="text-white font-pmedium text-xs">UNLOADING</Text>
          <Text className="text-white font-pbold text-xl mt-1">
            #{currentlyUnloading}
          </Text>
        </View>
        <View className="border-r border-white px-2 flex-1">
          <Text className="text-white font-pmedium text-xs">TOTAL</Text>
          <Text className="text-white font-pmedium text-xs">TRUCKS</Text>
          <Text className="text-white font-pbold text-xl mt-1">
            {totalTrucks} tons
          </Text>
        </View>
        <View className="border-r border-white px-2 flex-1">
          <Text className="text-white font-pmedium text-xs">COMPLETED</Text>
          <Text className="text-white font-pmedium text-xs">&nbsp;</Text>
          <Text className="text-white font-pbold text-xl mt-1">
            {completed}
          </Text>
        </View>
        <View className="pl-2 flex-1">
          <Text className="text-white font-pmedium text-xs">ON THE</Text>
          <Text className="text-white font-pmedium text-xs">WAY</Text>
          <Text className="text-white font-pbold text-xl mt-1">{onTheWay}</Text>
        </View>
      </View>
    </View>
  );
};

export default VirtualQueueHeader;
