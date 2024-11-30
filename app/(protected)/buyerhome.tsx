import React, { useEffect, useState } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import { StatusBar } from "expo-status-bar";
import SummaryCard from "@/components/SummaryCard";
import ChartSection from "@/components/HomeChart";
import PriceSection from "@/components/PriceSection";
import axios from "axios";

const CopraHome = () => {
    const [chartData, setChartData] = useState({
        expense_revenue: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }],
        },
    });

    const [totalTransaction, setTotalTransaction] = useState<number>(0);
    const [refreshing, setRefreshing] = useState(false);

    const [chartSummaryData, setChartSummaryData] = useState({
        expense_revenue: [
            { label: "Total Revenue", value: "₱0" },
            { label: "Average Revenue", value: "₱0" },
        ],
    });

    const onRefresh = () => {
        console.log("Manual refresh triggered");
        setRefreshing(true);
        fetchRevenueData();
        fetchTotalTrasaction();
        setRefreshing(false);
    };

    const fetchRevenueData = async () => {
        try {
            const response = await axios.get("/dashboard/coprahome");
            const { revenue } = response.data;
            console.log("revenue", revenue);

            setChartData({
                expense_revenue: {
                    labels: revenue.labels,
                    datasets: [{ data: revenue.datasets[0].data }],
                },
            });

            setChartSummaryData({
                expense_revenue: [
                    { label: "Total Revenue", value: revenue.summary.totalRevenue },
                    { label: "Average Revenue", value: revenue.summary.averageRevenue },
                ],
            });
        } catch (error) {
            console.error("Error fetching revenue data:", error);
        }
    };

    const fetchTotalTrasaction = async () => {
        try {
            const response = await axios.get("/dashboard/coprahome/total-transaction");
            const { totalTransaction } = response.data;
            setTotalTransaction(totalTransaction);
        } catch (error) {
            console.error("Error fetching revenue data:", error);
        }
    };

    useEffect(() => {
        fetchRevenueData();
        fetchTotalTrasaction();
    }, []);

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
            <ScrollView
                refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={refreshing} />}>
                <StatusBar style="dark" />
                <View className="px-4">
                    <View className="pt-4">
                        <SummaryCard
                            title="TODAY'S SUMMARY"
                            items={[
                                {
                                    label: "TOTAL REVENUE",
                                    value: chartSummaryData.expense_revenue[0].value,
                                    unit: "",
                                },
                                {
                                    label: "TOTAL TRANSACTIONS",
                                    value: totalTransaction
                                        ? totalTransaction.toString()
                                        : "Loading ....",
                                },
                            ]}
                        />
                    </View>

                    {/* Chart Section */}
                    <View className="mt-4">
                        <ChartSection
                            tabs={[{ key: "expense_revenue", label: "Revenue" }]}
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
