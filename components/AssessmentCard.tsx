import { VirtualQueueItem } from "@/types/type";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface AssessmentCardProps {
    item: VirtualQueueItem;
    index: number;
    onPress: (item: any) => void;
}

const AssessmentCard: React.FC<AssessmentCardProps> = ({
    item,
    index,
    onPress,
}) => {
    return (
        <TouchableOpacity
            onPress={() => onPress(item)}
            className={`bg-white rounded-lg p-3 mb-2 flex-row ${
                index === 0 ? "border-2 border-secondary-100" : ""
            }`}
        >
            {/* ID and Time Section */}
            <View className="w-1/5 justify-center">
                <Text className="text-lg font-bold text-primary">
                    #{item.id}
                </Text>
                <Text className="text-xs text-gray-500">{item.time}</Text>
            </View>

            {/* Owner and Plate Number Section */}
            <View className="w-2/5 justify-center">
                <Text className="text-sm font-semibold">{item.owner}</Text>
                <Text className="text-xs text-gray-500">
                    {item.plateNumber}
                </Text>
            </View>

            {/* Date and Status Section */}
            <View className="w-2/5 items-end justify-center">
                <Text className="text-sm">{item.date}</Text>
                {index === 0 && (
                    <Text className="text-xs text-secondary-200 font-semibold">
                        Currently Unloading
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

export default AssessmentCard;
