import React, { useEffect, useState } from "react";
import { View, ScrollView, StatusBar, Alert, RefreshControl } from "react-native";
import SummaryCard from "../../components/SummaryCard";
import ChartSection from "../../components/HomeChart";
import QueueSection from "../../components/QueueSection";
import type { QueueItem } from "../../types/type";
import axios from "axios";
import { useRouter } from "expo-router";

const OilHome = () => {
    const router = useRouter();

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
    const [unloadedTruckCount, setUnloadedTruckCount] = useState<number>(0);
    const [unloadedTruckCountLoading, setUnloadedTruckCountLoading] = useState<boolean>(true);
    const [queueData, setQueueData] = useState<QueueItem[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
        fetchQueue();
        setRefreshing(false);
    };

    const fetchData = async () => {
        try {
            const response = await axios.get("/dashboard/oilhome");
            const { expense, weight, chartSummaryData, unloadedTruck } = response.data;
            setUnloadedTruckCount(unloadedTruck || 0);
            setUnloadedTruckCountLoading(false);
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

    const fetchQueue = async () => {
        try {
            const response = await axios.get("/queue");
            console.log("Queue data:", response.data);
            setQueueData(response.data.queue || []);
        } catch (err: any) {
            console.error("Error fetching queue:", err);
            setQueueData([]);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
        fetchQueue();
    }, []);

    const handleSeeAllPress = () => {
        router.replace("queue");
    };

    const handleQueueItemPress = (item: QueueItem) => {
        console.log("Queue item pressed:", item);
    };

    return (
        <View className="flex-1 bg-off-100">
            <ScrollView
                refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={refreshing} />}>
                <StatusBar barStyle="dark-content" />
                <View className="px-4 pt-4">
                    <SummaryCard
                        title="TODAY'S SUMMARY"
                        items={[
                            {
                                label: "TOTAL EXPENSE",
                                value:
                                    chartSummaryData.expense.length > 0
                                        ? chartSummaryData.expense[0]["value"]
                                        : "loading...",
                            },
                            {
                                label: "TOTAL WEIGHT",
                                value:
                                    chartSummaryData.weight.length > 0
                                        ? chartSummaryData.weight[0]["value"]
                                        : "loading...",
                            },
                            {
                                label: "UNLOADED TRUCKS",
                                value: unloadedTruckCountLoading
                                    ? "loading..."
                                    : unloadedTruckCount,
                            },
                        ]}
                    />

                    <View className="mt-4">
                        <ChartSection
                            tabs={chartTabs}
                            chartData={chartData}
                            summaryData={chartSummaryData}
                        />
                    </View>

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
