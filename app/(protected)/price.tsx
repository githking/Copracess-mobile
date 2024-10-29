import React, { useState } from "react";
import { View, SafeAreaView, ScrollView, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import PriceChart from "@/components/PriceChart";
import BookingCalendar from "@/components/BookingCalendar";
import SetPriceModal from "@/components/PriceModal";
import PriceCard from "@/components/PriceCard";

const Price = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const marketAveragePrice = 47.25;

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setModalVisible(true);
  };

  const handleSetPrice = (date: string, price: number) => {
    setPrices((prevPrices) => ({
      ...prevPrices,
      [date]: price,
    }));
  };

  return (
    <SafeAreaView className="flex-1 bg-off-100">
      <ScrollView className="flex-1">
        <StatusBar style="dark" />
        <View className="p-4">
          <View className="flex-row mb-3">
            <PriceCard
              title="Today's Price"
              price={(prices[selectedDate] || 0).toFixed(2)}
              subtitle="Your set price"
            />
            <PriceCard
              title="Market Average"
              price={marketAveragePrice.toFixed(2)}
              subtitle="Based on recent data"
            />
          </View>
          <View className="bg-white rounded-lg shadow-sm mb-3">
            <PriceChart />
          </View>
          <Text className="text-lg font-pbold text-primary mb-2">
            Set Price
          </Text>
          <View className="bg-primary rounded-lg overflow-hidden">
            <BookingCalendar onDateSelect={handleDateSelect} />
          </View>
        </View>
      </ScrollView>
      <SetPriceModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSetPrice={handleSetPrice}
        selectedDate={selectedDate}
      />
    </SafeAreaView>
  );
};

export default Price;
