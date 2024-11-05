import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator } from "react-native";
import { Tabs, useRouter, Stack } from "expo-router";
import CustomHeader from "@/components/CustomHeader";
import { TabIconProps } from "@/types/type";
import { useAuth } from "@/context/AuthContext";
import Routes from "@/constants/tabRoutes";

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
  const { authState } = useAuth();
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />

        {/* Place the content separately */}
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#59A60E" />
        </View>
      </>
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
      <Stack.Screen
        options={{
          headerShown: true,
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
