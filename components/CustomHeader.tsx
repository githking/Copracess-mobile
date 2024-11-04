import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { images, icons } from "../constants";
import ScreenHeaderBtn from "./ScreenHeaderBtn";
import type { CustomHeaderProps } from "../types/type";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CustomHeader: React.FC<CustomHeaderProps> = ({
  notificationCount,
  onNotificationPress,
  onProfilePress,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top }} className="bg-white w-full">
      <View className="flex-row justify-between items-center px-4 py-2">
        <View className="flex-row items-center">
          <ScreenHeaderBtn
            iconUrl={images.logo}
            handlePress={() => {}}
            width={200}
            height={80}
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
    </View>
  );
};

export default CustomHeader;
