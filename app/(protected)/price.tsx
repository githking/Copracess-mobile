// app/(protected)/price.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  Text,
  ActivityIndicator,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import PriceChart from "@/components/PriceChart";
import BookingCalendar from "@/components/BookingCalendar";
import SetPriceModal from "@/components/PriceModal";
import PriceCard from "@/components/PriceCard";
import { useAuth } from "@/context/AuthContext";
import { fetchPrices, setPrice } from "@/services/price";

const Price = () => {
  const { authState } = useAuth();
  const [selectedDate, setSelectedDate] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priceData, setPriceData] = useState({
    currentPrice: 0,
    marketAverage: 0,
    priceHistory: [],
  });

  const loadPrices = async () => {
    if (!authState?.accessToken) return;

    try {
      setLoading(true);
      setError(null);
      const data = await fetchPrices(authState.accessToken);
      setPriceData({
        currentPrice: data.currentPrice?.price || 0,
        marketAverage: data.marketAverage || 0,
        priceHistory: data.priceHistory || [],
      });
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load prices");
      Alert.alert("Error", "Failed to load price data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrices();
  }, [authState?.accessToken]);

  const handleDateSelect = (date: string) => {
    const today = new Date().toISOString().split("T")[0];
    const selectedDateStr = new Date(date).toISOString().split("T")[0];

    // Only allow setting/updating price for today
    if (selectedDateStr !== today) {
      Alert.alert("Notice", "You can only set or update today's price.", [
        { text: "OK" },
      ]);
      return;
    }

    setSelectedDate(date);
    setModalVisible(true);
  };

  const handleSetPrice = async (date: string, newPrice: number) => {
    if (!authState?.accessToken) return;

    try {
      setLoading(true);
      await setPrice(authState.accessToken, newPrice);
      await loadPrices(); // Reload prices after setting new price
      Alert.alert(
        "Success",
        priceData.currentPrice > 0
          ? "Price updated successfully"
          : "Price set successfully"
      );
    } catch (err: any) {
      Alert.alert(
        "Error",
        err.response?.data?.message || "Failed to update price"
      );
    } finally {
      setLoading(false);
      setModalVisible(false);
    }
  };

  if (loading && !priceData.currentPrice) {
    return (
      <View className="flex-1 bg-off-100 justify-center items-center">
        <ActivityIndicator size="large" color="#59A60E" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-off-100">
      <ScrollView className="flex-1">
        <StatusBar style="dark" />
        <View className="p-4">
          {error ? (
            <View className="bg-red-100 p-4 rounded-lg mb-3">
              <Text className="text-red-600">{error}</Text>
            </View>
          ) : null}

          <View className="flex-row mb-3">
            <PriceCard
              title="Today's Price"
              price={priceData.currentPrice.toFixed(2)}
              subtitle="Your set price"
            />
            <PriceCard
              title="Market Average"
              price={priceData.marketAverage.toFixed(2)}
              subtitle="Based on recent data"
            />
          </View>

          <View className="bg-white rounded-lg shadow-sm mb-3">
            <PriceChart
              priceHistory={priceData.priceHistory}
              isLoading={loading}
            />
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
        currentPrice={priceData.currentPrice} // Pass current price
      />
    </SafeAreaView>
  );
};

export default Price;
