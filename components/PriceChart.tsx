import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  ActivityIndicator,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { icons } from "../constants";
import type { Filters } from "../types/type";
import FilterModal from "./FilterModal";

const screenWidth = Dimensions.get("window").width;

const Header: React.FC<{ title: string; onOpenFilter: () => void }> = ({
  title,
  onOpenFilter,
}) => (
  <View className="flex-row justify-between items-center p-2">
    <Text className="text-lg font-pbold text-primary">{title}</Text>
    <TouchableOpacity
      onPress={onOpenFilter}
      className="border border-primary p-1 rounded-md bg-white"
    >
      <Image
        source={icons.filter}
        className="w-5 h-5"
        style={{ tintColor: "#59A60E" }}
      />
    </TouchableOpacity>
  </View>
);

const chartConfig = {
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: "4",
    strokeWidth: "2",
  },
  propsForLabels: {
    fontSize: 11,
    fontFamily: "Poppins-Regular",
  },
  propsForVerticalLabels: {
    fontSize: 10,
    rotation: 0,
    fontFamily: "Poppins-Regular",
  },
  propsForHorizontalLabels: {
    fontSize: 10,
    fontFamily: "Poppins-Regular",
  },
  formatYLabel: (value: string) => `₱${parseFloat(value).toFixed(1)}`,
};

interface PriceChartProps {
  priceHistory: Array<{
    date: string;
    price: number;
    market_price: number;
  }>;
  isLoading?: boolean;
}

const PriceChart: React.FC<PriceChartProps> = ({
  priceHistory,
  isLoading = false,
}) => {
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  if (isLoading) {
    return (
      <View className="bg-white p-4 rounded-lg h-[300px] justify-center items-center">
        <ActivityIndicator size="large" color="#59A60E" />
      </View>
    );
  }

  if (!priceHistory || priceHistory.length === 0) {
    return (
      <View className="bg-white p-4 rounded-lg h-[300px] justify-center items-center">
        <Text className="text-gray-500 font-pregular">
          No price history available
        </Text>
      </View>
    );
  }

  const lastSevenDays = priceHistory.slice(-7);

  const chartData = {
    labels: lastSevenDays.map((p) =>
      new Date(p.date).toLocaleDateString("en-US", { weekday: "short" })
    ),
    datasets: [
      {
        data: lastSevenDays.map((p) => p.price || 0),
        color: (opacity = 1) => `rgba(89, 166, 14, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: lastSevenDays.map((p) => p.market_price || 0),
        color: (opacity = 1) => `rgba(255, 193, 7, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ["Set Price", "Market Average"],
  };

  return (
    <View className="bg-white p-4 rounded-lg">
      <Header
        title="Price Chart"
        onOpenFilter={() => setIsFilterModalVisible(true)}
      />

      <View className="mt-4">
        <LineChart
          data={chartData}
          width={screenWidth - 56}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={{
            borderRadius: 8,
            paddingRight: 0,
          }}
          withVerticalLines={false}
          withHorizontalLines={true}
          withDots={true}
          withShadow={false}
          withScrollableDot={false}
          withInnerLines={false}
          yAxisLabel="₱"
          yAxisSuffix=""
          yAxisInterval={2}
          segments={5}
          fromZero
        />
      </View>

      {/* Legend */}
      <View className="flex-row justify-center items-center mt-4 space-x-6">
        <View className="flex-row items-center">
          <View className="w-2.5 h-2.5 rounded-full bg-primary mr-2" />
          <Text className="text-xs font-pmedium text-gray-700">Set Price</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-2.5 h-2.5 rounded-full bg-secondary mr-2" />
          <Text className="text-xs font-pmedium text-gray-700">
            Market Average
          </Text>
        </View>
      </View>

      <FilterModal
        visible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        onApplyFilters={(filters: Filters) => {
          console.log("Filters applied:", filters);
          setIsFilterModalVisible(false);
        }}
      />
    </View>
  );
};

export default PriceChart;
