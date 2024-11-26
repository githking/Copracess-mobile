import React, { useEffect, useState } from "react";
import { View, ScrollView, StatusBar, Alert } from "react-native";
import SummaryCard from "../../components/SummaryCard";
import ChartSection from "../../components/HomeChart";
import QueueSection from "../../components/QueueSection";
import type { QueueItem } from "../../types/type";
import axios from "axios";

const OilHome = () => {
    const chartTabs = [
        { key: "expense", label: "Expense" },
        { key: "weight", label: "Weight" },
    ];

    const [chartData, setChartData] = useState({
        expense: { labels: [], datasets: [{ data: [] }] },
        weight: { labels: [], datasets: [{ data: [] }] },
    });

    const [chartSummaryData, setChartSummaryData] = useState({
        expense: [],
        weight: [],
    });

    const [queueData, setQueueData] = useState<QueueItem[]>([]);

    // Queue data
    // const queueData: QueueItem[] = [
    //   {
    //     id: "1",
    //     title: "John Smith",
    //     subtitle: "10:30 AM",
    //     status: "Arriving",
    //     statusColor: "secondary",
    //     icon: "person",
    //     time: "10:30 AM",
    //     plateNumber: "ABC123",
    //     owner: "John Smith",
    //     date: "2023-10-01",
    //   },
    //   {
    //     id: "2",
    //     title: "Mike Johnson",
    //     subtitle: "11:00 AM",
    //     status: "Queued",
    //     statusColor: "primary",
    //     icon: "person",
    //     time: "11:00 AM",
    //     plateNumber: "XYZ789",
    //     owner: "Mike Johnson",
    //     date: "2023-10-01",
    //   },
    // ];

    const fetchData = async () => {
        try {
            const response = await axios.get("/dashboard/oilhome");
            const { expense, weight, chartSummaryData } = response.data;

            console.log("expense,", expense);
            console.log("weight,", weight);
            console.log("chartSummaryData,", chartSummaryData);

            setChartData({
                expense: expense,
                weight: weight,
            });
            setChartSummaryData(chartSummaryData);
        } catch (error) {
            console.error("Error fetching oil home data:", error);
            Alert.alert("Error", "Failed to fetch data from the server.");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

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
