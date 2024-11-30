// components/PriceSection.tsx
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { images } from "@/constants";
import type { PriceCardItem, PriceSectionProps } from "@/types/type";

const PriceCard = ({ item }: { item: PriceCardItem }) => (
    <View className="bg-white p-4 rounded-lg mb-3 flex-row justify-between items-center">
        <View className="flex-row items-center space-x-3">
            <View className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden">
                <Image source={images.oilmill} className="w-full h-full" resizeMode="cover" />
            </View>
            <View>
                <Text className="font-pmedium text-black text-base">{item.millName}</Text>
                <Text className="text-gray-100 text-sm">
                    Previous: ₱{!item.subPrice ? 0 : item.subPrice}
                </Text>
            </View>
        </View>
        <View>
            <Text className="text-primary text-base font-pbold text-right">₱{item.price}</Text>
        </View>
    </View>
);

const PriceSection: React.FC<PriceSectionProps> = ({ data, average }) => {
    return (
        <View>
            <View className="flex-row justify-between items-center mb-3">
                <View>
                    <Text className="text-black text-lg font-pbold">Daily Market Price</Text>
                    <Text className="text-gray-100 text-sm">Average: ₱{average}/kg</Text>
                </View>
            </View>

            {data.map((item) => (
                <PriceCard key={item.id} item={item} />
            ))}
        </View>
    );
};

export default PriceSection;
