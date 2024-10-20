import React, { useState, useRef } from "react";
import {
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import VirtualQueueHeader from "../../components/VirtualQueueHeader";
import VirtualQueueTable from "../../components/VirtualQueueTable";

const Queue: React.FC = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [maxScrollY, setMaxScrollY] = useState(1);

  const handleScanQR = () => {
    console.log("Open QR Scanner");
  };

  const handleContentSizeChange = (contentWidth: number, height: number) => {
    setMaxScrollY(Math.max(height - 400, 1));
  };

  const opacity = scrollY.interpolate({
    inputRange: [0, maxScrollY],
    outputRange: [1, 0.2],
    extrapolate: "clamp",
  });

  return (
    <SafeAreaView className="flex-1 bg-off-100">
      <StatusBar barStyle="dark-content" backgroundColor="#FBF6EE" />
      <View className="flex-1">
        <Animated.ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          onContentSizeChange={handleContentSizeChange}
        >
          <View className="p-4">
            <VirtualQueueHeader
              queueNumber="VQ-321"
              currentlyUnloading={246}
              totalTrucks={78}
              completed={13}
              onTheWay={42}
            />
            <VirtualQueueTable />
          </View>
        </Animated.ScrollView>
        <Animated.View
          style={{ opacity }}
          className="absolute bottom-5 left-0 right-0 items-center"
        >
          <TouchableOpacity
            onPress={handleScanQR}
            className="w-20 h-20 bg-primary border-4 border-secondary-100 rounded-full items-center justify-center shadow-lg"
            style={{
              elevation: 8,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
            }}
          >
            <Ionicons name="qr-code-outline" size={45} color="white" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

export default Queue;
