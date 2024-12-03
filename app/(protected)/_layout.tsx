import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator } from "react-native";
import { Tabs, useRouter } from "expo-router";
import CustomHeader from "@/components/CustomHeader";
import { TabIconProps } from "@/types/type";
import { useAuth } from "@/context/AuthContext";
import Routes from "@/constants/tabRoutes";

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
  const { authState } = useAuth();
  const [loading, setLoading] = useState(true);
  const notificationCount = 3;

  useEffect(() => {
    if (!authState?.authenticated) {
      router.replace("/signIn");
    } else if (authState?.data?.role) {
      setLoading(false);
    }
  }, [authState?.authenticated, authState?.data?.role]);

  const handleProfilePress = () => {
    router.push("/settings");
  };

  const handleNotificationPress = () => {
    console.log("Notification pressed");
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#59A60E" />
      </View>
    );
  }

  // Determine roles after authState is loaded
  const isOilmill =
    authState?.data?.role === "OIL_MILL_MEMBER" ||
    authState?.data?.role === "OIL_MILL_MANAGER";
  const isCopraOwner = authState?.data?.role === "COPRA_BUYER";

  const tabScreens = Routes(isOilmill, isCopraOwner);

  return (
    <>
      <CustomHeader
        notificationCount={notificationCount}
        onNotificationPress={handleNotificationPress}
        onProfilePress={handleProfilePress}
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
          header: () => null, // Explicitly set header to null for tab screens
        }}
      >
        {tabScreens.map((screen) => (
          <Tabs.Screen
            key={screen.name}
            name={screen.name}
            options={{
              title: "",
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={screen.icon}
                  color={color}
                  name={screen.label}
                  focused={focused}
                />
              ),
              href: screen.href,
            }}
          />
        ))}
      </Tabs>
    </>
  );
};

export default TabsLayout;
