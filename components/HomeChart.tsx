import React, { useState } from "react";
import { View, Text, TouchableOpacity, Dimensions, Image } from "react-native";
import { LineChart, BarChart } from "react-native-chart-kit";
import type { ChartSectionProps, ChartData, Filters } from "../types/type";
import FilterModal from "@/components/FilterModal";
import { icons } from "@/constants";

const screenWidth = Dimensions.get("window").width;

const defaultChartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(89, 166, 14, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    propsForLabels: {
        fontSize: 12,
        fontFamily: "Poppins-Regular",
    },
};

const ChartSection: React.FC<ChartSectionProps> = ({
    tabs,
    chartData,
    summaryData,
    chartConfig = defaultChartConfig,
    containerClassName = "",
    height = 220,
}) => {
    const [activeTab, setActiveTab] = useState(tabs[0].key);
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

    const renderChart = (type: string, data: ChartData) => {
        const commonProps = {
            data,
            width: screenWidth - 50,
            height,
            chartConfig,
            style: {
                marginVertical: 8,
                borderRadius: 16,
            },
            withInnerLines: false,
            withOuterLines: false,
        };

        return type === "line" ? (
            <LineChart {...commonProps} bezier withDots={true} withShadow={false} />
        ) : (
            <BarChart
                {...commonProps}
                showValuesOnTopOfBars
                showBarTops={false}
                fromZero
                yAxisLabel=""
                yAxisSuffix=""
            />
        );
    };

    return (
        <View className={`bg-white rounded-lg p-4 ${containerClassName}`}>
            <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row">
                    {tabs.map((tab) => (
                        <TouchableOpacity
                            key={tab.key}
                            onPress={() => setActiveTab(tab.key)}
                            className={`px-3 py-1 rounded-full mr-2 ${
                                activeTab === tab.key
                                    ? "bg-primary"
                                    : "bg-white border border-primary"
                            }`}>
                            <Text
                                className={`${
                                    activeTab === tab.key ? "text-white" : "text-primary"
                                } font-pmedium`}>
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* <TouchableOpacity
                    className="p-1.5 border border-primary bg-white rounded-md"
                    onPress={handleOpenFilterModal}>
                    <Image
                        source={icons.filter}
                        className="w-7 h-7"
                        style={{ tintColor: "#59A60E" }}
                    />
                </TouchableOpacity> */}
            </View>

            <View>
                <View className="flex-row justify-between mb-4">
                    {summaryData[activeTab].map((item, index) => (
                        <View key={index}>
                            <Text className="text-gray-100">{item.label}</Text>
                            <Text className="text-primary text-lg font-pbold">{item.value}</Text>
                        </View>
                    ))}
                </View>
                {renderChart(activeTab.includes("expense") ? "line" : "bar", chartData[activeTab])}
            </View>

            {/* <FilterModal
        visible={isFilterModalVisible}
        onClose={handleCloseFilterModal}
        onApplyFilters={handleApplyFilters}
      /> */}
        </View>
    );
};

export default ChartSection;
