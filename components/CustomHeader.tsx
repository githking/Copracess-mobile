import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { images, icons } from "../constants";
import ScreenHeaderBtn from "./ScreenHeaderBtn";

import type { CustomHeaderProps } from "../types/type";

const CustomHeader: React.FC<CustomHeaderProps> = ({
  notificationCount,
  onNotificationPress,
  onProfilePress,
}) => {
  return (
    <View className="flex-row justify-between items-center w-full px-4 mt-8">
      <View className="flex-row items-center">
        <ScreenHeaderBtn
          iconUrl={images.logo}
          handlePress={() => {}}
          width={200}
          height={90}
        />
      </View>
      <View className="flex-row items-center">
        <TouchableOpacity
          className="mr-4 relative"
          onPress={onNotificationPress}
        >
          <Image source={icons.notification} className="w-6 h-6" />
          {notificationCount > 0 && (
            <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[16px] h-4 flex items-center justify-center">
              <Text className="text-primary text-xs font-pbold px-1">
                {notificationCount > 99 ? "99+" : notificationCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={onProfilePress}>
          <View className="w-9 h-9 rounded-full bg-primary justify-center items-center">
            <Image
              source={icons.profile}
              className="w-5 h-5"
              tintColor={"#FFFFFF"}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomHeader;
