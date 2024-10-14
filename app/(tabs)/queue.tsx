import React from "react";
import { View, ScrollView, SafeAreaView, StatusBar } from "react-native";
import VirtualQueueHeader from "../../components/VirtualQueueHeader";
import VirtualQueueTable from "../../components/VirtualQueueTable";

const queue: React.FC = () => {
  return (
    <SafeAreaView className="flex-1 bg-off-100">
      <StatusBar barStyle="dark-content" backgroundColor="#FBF6EE" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="p-4">
          <VirtualQueueHeader
            queueNumber="VQ-321"
            currentlyUnloading={24}
            totalTrucks={78}
            completed={13}
            onTheWay={42}
          />
          <VirtualQueueTable />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default queue;
