import React from "react";
import { View, ScrollView, StatusBar } from "react-native";
import SummaryCard from "../../components/SummaryCard";
import ChartSection from "../../components/HomeChart";
import QueueSection from "../../components/QueueSection";
import type { QueueItem } from "../../types/type";

const OilHome = () => {
  // Chart configuration
  const chartTabs = [
    { key: "expense", label: "Expense" },
    { key: "weight", label: "Weight" },
  ];

  const chartData = {
    expense: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          data: [420000, 457400, 495400, 480000, 450000, 470000, 490000],
        },
      ],
    },
    weight: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          data: [85, 95, 65, 90, 75, 85, 88],
        },
      ],
    },
  };

  const chartSummaryData = {
    expense: [
      { label: "Total expense", value: "₱3,202,200" },
      { label: "Average expense", value: "₱457,300" },
    ],
    weight: [
      { label: "Total weight", value: "748 TONS" },
      { label: "Average weight", value: "103 TONS" },
    ],
  };

  // Queue data
  const queueData: QueueItem[] = [
    {
      id: "1",
      title: "John Smith",
      subtitle: "10:30 AM",
      status: "Arriving",
      statusColor: "secondary",
      icon: "person",
      time: "10:30 AM",
      plateNumber: "ABC123",
      owner: "John Smith",
      date: "2023-10-01",
    },
    {
      id: "2",
      title: "Mike Johnson",
      subtitle: "11:00 AM",
      status: "Queued",
      statusColor: "primary",
      icon: "person",
      time: "11:00 AM",
      plateNumber: "XYZ789",
      owner: "Mike Johnson",
      date: "2023-10-01",
    },
  ];

  const handleSeeAllPress = () => {
    console.log("See all pressed");
  };

  const handleQueueItemPress = (item: QueueItem) => {
    console.log("Queue item pressed:", item);
  };

  return (
    <View className="flex-1 bg-off-100">
      <ScrollView>
        <StatusBar barStyle="dark-content" />
        <View className="px-4 pt-4">
          {/* Summary Cards */}
          <SummaryCard
            title="TODAY'S SUMMARY"
            items={[
              {
                label: "TOTAL EXPENSE",
                value: "223,105",
                unit: "₱",
              },
              {
                label: "TOTAL WEIGHT",
                value: "78",
                unit: "tons",
              },
              {
                label: "UNLOADED TRUCKS",
                value: 13,
              },
            ]}
          />

          {/* Chart Section */}
          <View className="mt-4">
            <ChartSection
              tabs={chartTabs}
              chartData={chartData}
              summaryData={chartSummaryData}
            />
          </View>

          {/* Queue Section */}
          <View className="mt-4">
            <QueueSection
              title="Virtual Queue"
              data={queueData}
              onSeeAllPress={handleSeeAllPress}
              onItemPress={handleQueueItemPress}
              showAvatar={true}
              emptyStateText="No vehicles in queue"
              seeAllText="View All"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default OilHome;
