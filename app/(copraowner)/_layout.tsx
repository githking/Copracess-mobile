import React from "react";
import { View, Text, Image } from "react-native";
import { Tabs, Stack, useRouter } from "expo-router";
import { icons } from "../../constants";
import CustomHeader from "../../components/CustomHeader";
import { TabIconProps } from "../../types/type";

const notificationCount = 3;
const handleNotificationPress = () => {
  console.log("Notification pressed");
};

const TabIcon = ({ icon, color, name, focused }: TabIconProps) => (
  <View className="items-center justify-center gap-2">
    <Image
      source={icon}
      resizeMode="contain"
      tintColor={color}
      className="w-6 h-6"
    />
    <Text
      className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
      style={{ color: color }}
    >
      {name}
    </Text>
  </View>
);

const TabsLayout = () => {
  const router = useRouter();

  const handleProfilePress = () => {
    // Navigate to the SettingsPage
    router.push("/settings");
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: "white",
          },
          header: () => (
            <CustomHeader
              notificationCount={notificationCount}
              onNotificationPress={handleNotificationPress}
              onProfilePress={handleProfilePress}
            />
          ),
        }}
      />
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#59A60E",
          tabBarInactiveTintColor: "#080807",
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            borderTopWidth: 1,
            borderTopColor: "#E5E5E5",
            height: 80,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.window}
                color={color}
                name="Home"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="transaction"
          options={{
            title: "",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.records}
                color={color}
                name="Transaction"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="booking"
          options={{
            title: "",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.booking}
                color={color}
                name="Booking"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="map"
          options={{
            title: "",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.millmap}
                color={color}
                name="Map"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;