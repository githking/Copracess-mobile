import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { QueueSectionProps, QueueItem } from "../types/type";

const QueueCard = ({
  item,
  showAvatar,
  onPress,
}: {
  item: QueueItem;
  showAvatar?: boolean;
  onPress?: (item: QueueItem) => void;
}) => (
  <TouchableOpacity
    className="bg-white p-4 rounded-lg mb-3 flex-row justify-between items-center"
    onPress={() => onPress?.(item)}
  >
    <View className="flex-row items-center">
      {showAvatar && (
        <View className="w-10 h-10 bg-primary rounded-full justify-center items-center mr-3">
          <MaterialIcons
            name={
              (item.icon as keyof typeof MaterialIcons.glyphMap) || "person"
            }
            size={24}
            color="white"
          />
        </View>
      )}
      <View>
        <Text className="font-pmedium text-black">{item.title}</Text>
        <Text className="text-gray-100 text-sm">{item.subtitle}</Text>
      </View>
    </View>
    <View
      className={`px-3 py-1 rounded-full ${
        item.statusColor === "secondary" ? "bg-secondary/20" : "bg-primary/20"
      }`}
    >
      <Text
        className={`${
          item.statusColor === "secondary" ? "text-secondary" : "text-primary"
        } font-pmedium`}
      >
        {item.status}
      </Text>
    </View>
  </TouchableOpacity>
);

const QueueSection: React.FC<QueueSectionProps> = ({
  title,
  seeAllText = "See All",
  data,
  onSeeAllPress,
  containerClassName = "",
  emptyStateText = "No items found",
  showAvatar = true,
  onItemPress,
}) => {
  const renderHeader = () => (
    <View className="flex-row justify-between items-center mb-4">
      <Text className="text-lg font-pbold text-black">{title}</Text>
      {onSeeAllPress && (
        <TouchableOpacity onPress={onSeeAllPress}>
          <Text className="text-primary font-pmedium">{seeAllText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderItem = ({ item }: { item: QueueItem }) => (
    <QueueCard item={item} showAvatar={showAvatar} onPress={onItemPress} />
  );

  const renderEmpty = () => (
    <View className="flex items-center justify-center py-8">
      <Text className="text-gray-100 text-sm">{emptyStateText}</Text>
    </View>
  );

  return (
    <View className={`mt-4 ${containerClassName}`}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </View>
  );
};

export default QueueSection;
