import React from "react";
import { View, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import SummaryCard from "@/components/SummaryCard";
import ChartSection from "@/components/HomeChart";
import PriceSection from "@/components/PriceSection";

const CopraHome = () => {
  // Chart configuration
  const chartTabs = [{ key: "expense_revenue", label: "Revenue" }];

  const chartData = {
    expense_revenue: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          data: [420000, 457400, 495400, 480000, 450000, 470000, 490000],
        },
      ],
    },
  };

  const chartSummaryData = {
    expense_revenue: [
      { label: "Total Revenue", value: "₱3,202,200" },
      { label: "Average Revenue", value: "₱457,300" },
    ],
  };

  // Dummy data for price list
  const priceData = [
    {
      id: "1",
      millName: "JTP Oil Mill",
      price: "48.50",
      subPrice: "47.75",
    },
    {
      id: "2",
      millName: "Tantangan Oil Mill",
      price: "49.25",
      subPrice: "48.50",
    },
    {
      id: "3",
      millName: "Mindanao Oil",
      price: "47.75",
      subPrice: "47.00",
    },
    {
      id: "4",
      millName: "South Cotabato Mill",
      price: "48.75",
      subPrice: "48.00",
    },
  ];

  const handleViewAllPrices = () => {
    console.log("View all prices pressed");
  };

  return (
    <View className="flex-1 bg-off-100">
      <ScrollView>
        <StatusBar style="dark" />
        <View className="px-4">
          {/* Summary Cards */}
          <View className="pt-4">
            <SummaryCard
              title="TODAY'S SUMMARY"
              items={[
                {
                  label: "TOTAL REVENUE",
                  value: "223,105",
                  unit: "₱",
                },
                {
                  label: "TOTAL TRANSACTIONS",
                  value: "78",
                },
              ]}
            />
          </View>

          {/* Chart Section */}
          <View className="mt-4">
            <ChartSection
              tabs={chartTabs}
              chartData={chartData}
              summaryData={chartSummaryData}
            />
          </View>

          {/* Price Section */}
          <View className="mt-4">
            <PriceSection
              data={priceData}
              average="48.56"
              onViewAll={handleViewAllPrices}
            />
          </View>

          {/* Bottom Spacing */}
          <View className="h-4" />
        </View>
      </ScrollView>
    </View>
  );
};

export default CopraHome;
