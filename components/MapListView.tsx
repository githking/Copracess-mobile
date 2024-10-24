import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MillCard from "../components/MillCard";
import type { Mill } from "../types/type";
import SearchInput from "./SearchInput";
import { icons } from "../constants";
import type { ListViewProps } from "../types/type";

const ListView: React.FC<ListViewProps> = ({ oilMills, onSwitchView }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("nearest");

  const categories = [
    { id: "nearest", label: "Nearest" },
    { id: "recent", label: "Recent" },
    { id: "all", label: "All Mills" },
  ];

  const handleBookPress = (millId: string) => {
    console.log("Booking mill:", millId);
    // Implement booking logic here
  };

  const filteredMills = useCallback(() => {
    return oilMills.filter(
      (mill) =>
        mill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mill.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [oilMills, searchQuery]);

  return (
    <SafeAreaView className="flex-1 bg-off-100">
      <View className="flex-1 px-4">
        {/* Header */}
        <View className="flex-row justify-between items-center py-4">
          <Text className="text-2xl font-pbold text-black">Oil Mills</Text>
          <TouchableOpacity
            onPress={onSwitchView}
            className="bg-white p-2 rounded-md shadow-sm"
          >
            <Text className="text-primary font-pmedium">Map View</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="mb-4">
          <SearchInput icon={icons.search} handlePress={() => {}} />
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4"
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => setActiveCategory(category.id)}
              className={`mr-4 px-6 py-2 rounded-full ${
                activeCategory === category.id ? "bg-primary" : "bg-white"
              }`}
            >
              <Text
                className={`font-pmedium ${
                  activeCategory === category.id
                    ? "text-white"
                    : "text-gray-100"
                }`}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Mills List */}
        <FlatList
          data={filteredMills()}
          renderItem={({ item }) => (
            <MillCard
              mill={item}
              onBookPress={handleBookPress}
              variant="list"
            />
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center pt-10">
              <Text className="text-gray-100 font-pmedium">
                No oil mills found
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default ListView;
