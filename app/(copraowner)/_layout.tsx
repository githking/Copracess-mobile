import React, { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import { Tabs, Stack, useRouter } from "expo-router";
import { icons } from "../../constants";
import CustomHeader from "../../components/CustomHeader";
import { TabIconProps } from "../../types/type";
import SplashScreen from "../../components/SplashScreen";

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
  const [isCopraOwner, setIsCopraOwner] = useState(false);
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleProfilePress = () => {
    router.push("/settings");
  };

  // useEffect(() => {
  //   if (user) {
  //     const role = user.publicMetadata.role;
  //     setIsCopraOwner(role === "COPRA_BUYER");
  //     setIsSplashVisible(false);
  //   } else {
  //     setIsSplashVisible(false);
  //   }
  // }, [user]);

  useEffect(() => {
    if (!isCopraOwner && !isSplashVisible && !isRedirecting) {
      setIsRedirecting(true);
      router.replace("/(copraowner)/home");
    }
  }, [isCopraOwner, isSplashVisible, isRedirecting]);

  if (isSplashVisible) {
    return <SplashScreen onFinish={() => setIsSplashVisible(false)} />;
  }

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
            href: "/home",
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
            href: "/transaction",
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
            href: "/booking",
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
            href: "/map",
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
        <Tabs.Screen
          name="settings"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
