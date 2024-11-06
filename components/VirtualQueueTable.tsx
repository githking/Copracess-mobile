import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { icons } from "../constants";
import SearchInput from "./SearchInput";
import FilterModal from "./FilterModal";
import type { VirtualQueueItem, Filters } from "@/types/type";

const windowWidth = Dimensions.get("window").width;

const Trucks: VirtualQueueItem[] = [
  {
    id: "246",
    time: "10:38 am",
    plateNumber: "ASD153",
    owner: "Joshua Gonzales",
    date: "4/9/2024",
  },
  {
    id: "247",
    time: "10:40 am",
    plateNumber: "JHC765",
    owner: "King Hezron",
    date: "4/9/2024",
  },
  {
    id: "248",
    time: "10:45 am",
    plateNumber: "ZAC103",
    owner: "Bob Cano",
    date: "4/9/2024",
  },
  {
    id: "249",
    time: "11:05 am",
    plateNumber: "JAB809",
    owner: "Christ David",
    date: "4/9/2024",
  },
  {
    id: "250",
    time: "11:18 am",
    plateNumber: "CLI098",
    owner: "Lemuel Zaldua",
    date: "4/9/2024",
  },
  {
    id: "251",
    time: "11:20 am",
    plateNumber: "HAG721",
    owner: "Joseph Laurel",
    date: "4/9/2024",
  },
  {
    id: "252",
    time: "11:43 am",
    plateNumber: "BAN571",
    owner: "Kalisto Jade",
    date: "4/9/2024",
  },
  {
    id: "253",
    time: "1:30 pm",
    plateNumber: "KAU791",
    owner: "Ken Bento",
    date: "4/9/2024",
  },
  {
    id: "254",
    time: "1:36 pm",
    plateNumber: "BAH112",
    owner: "Richard Canto",
    date: "4/9/2024",
  },
  {
    id: "255",
    time: "1:43 pm",
    plateNumber: "POT612",
    owner: "Rusty Balboa",
    date: "4/9/2024",
  },
  {
    id: "36",
    time: "1:57 pm",
    plateNumber: "KAU118",
    owner: "Jester Yago",
    date: "4/9/2024",
  },
];

const VirtualQueueFlatList: React.FC = () => {
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const handleOpenFilterModal = () => {
    setIsFilterModalVisible(true);
  };

  const handleCloseFilterModal = () => {
    setIsFilterModalVisible(false);
  };

  const handleApplyFilters = (filters: Filters) => {
    console.log("Filters applied:", filters);
    handleCloseFilterModal();
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: VirtualQueueItem;
    index: number;
  }) => (
    <View
      className={`bg-white rounded-lg p-3 mb-2 flex-row ${
        index === 0 ? "border-2 border-secondary-100" : ""
      }`}
    >
      <View className="w-1/5 justify-center">
        <Text className="text-lg font-bold text-primary">#{item.id}</Text>
        <Text className="text-xs text-gray-500">{item.time}</Text>
      </View>
      <View className="w-2/5 justify-center">
        <Text className="text-sm font-semibold">{item.owner}</Text>
        <Text className="text-xs text-gray-500">{item.plateNumber}</Text>
      </View>
      <View className="w-2/5 items-end justify-center">
        <Text className="text-sm">{item.date}</Text>
        {index === 0 && (
          <Text className="text-xs text-secondary-200 font-semibold">
            Currently Unloading
          </Text>
        )}
      </View>
    </View>
  );

  const ListHeaderComponent = () => (
    <>
      <View className="flex-row items-center mb-4">
        <View className="flex-1 mr-2">
          <SearchInput icon={icons.search} handlePress={() => {}} />
        </View>
        <TouchableOpacity
          onPress={handleOpenFilterModal}
          className="bg-white p-2 rounded"
        >
          <Image
            source={icons.filter}
            className="w-6 h-6"
            style={{ tintColor: "#59A60E" }}
          />
        </TouchableOpacity>
      </View>
    </>
  );

  const ListFooterComponent = () => (
    <View className="flex-row justify-between mt-4">
      <TouchableOpacity className="bg-white rounded-lg px-6 py-2">
        <Text className="text-primary font-medium">PREVIOUS</Text>
      </TouchableOpacity>
      <TouchableOpacity className="bg-white rounded-lg px-6 py-2">
        <Text className="text-primary font-medium">NEXT</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="bg-primary flex-1 rounded-lg">
      <FlatList
        data={Trucks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />

      <FilterModal
        visible={isFilterModalVisible}
        onClose={handleCloseFilterModal}
        onApplyFilters={handleApplyFilters}
      />
    </SafeAreaView>
  );
};

export default VirtualQueueFlatList;
