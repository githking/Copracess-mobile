import React, { useState } from "react";
import { View, Text, TouchableOpacity, Dimensions, Image } from "react-native";
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

const data = {
  labels: ["M", "T", "W", "T", "F", "S", "S"],
  datasets: [
    {
      data: [15, 25, 20, 35, 30, 40, 25],
      color: (opacity = 1) => `rgba(89, 166, 14, ${opacity})`,
      strokeWidth: 2,
    },
    {
      data: [20, 30, 25, 40, 35, 45, 30],
      color: (opacity = 1) => `rgba(255, 193, 7, ${opacity})`,
      strokeWidth: 2,
    },
  ],
  legend: ["Set Price", "Market Average"],
};

const chartConfig = {
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  propsForLabels: {
    fontSize: 10,
    fontWeight: "bold",
  },
  propsForVerticalLabels: {
    fontSize: 10,
    fontWeight: "bold",
  },
  propsForHorizontalLabels: {
    fontSize: 10,
    fontWeight: "bold",
  },
  propsForBackgroundLines: {
    strokeWidth: 1,
    stroke: "#e0e0e0",
  },
  propsForLegend: {
    color: "#000",
  },
  propsForDots: {
    r: "4",
    strokeWidth: "2",
    stroke: "#fafafa",
  },
};

const PriceChart: React.FC = () => {
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

  return (
    <View className="bg-white p-2 rounded-lg">
      <Header title="Price Chart" onOpenFilter={handleOpenFilterModal} />
      <LineChart
        data={data}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={{
          marginVertical: 4,
          borderRadius: 8,
        }}
        withVerticalLines={true}
        withHorizontalLines={true}
        withInnerLines={true}
        withDots={true}
        withShadow={false}
        yAxisLabel="₱"
        yAxisSuffix=""
        yAxisInterval={1}
        fromZero
      />
      <FilterModal
        visible={isFilterModalVisible}
        onClose={handleCloseFilterModal}
        onApplyFilters={handleApplyFilters}
      />
    </View>
  );
};

export default PriceChart;
