import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import SummaryCard from "@/components/SummaryCard";
import ChartSection from "@/components/HomeChart";
import PriceSection from "@/components/PriceSection";
import axios from "axios";

const CopraHome = () => {
    // State to hold the chart data and summary
    const [chartData, setChartData] = useState({
        expense_revenue: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }],
        },
    });

    const [chartSummaryData, setChartSummaryData] = useState({
        expense_revenue: [
            { label: "Total Revenue", value: "₱0" },
            { label: "Average Revenue", value: "₱0" },
        ],
    });

    // Fetch revenue data from the API
    const fetchRevenueData = async () => {
        try {
            const response = await axios.get("/dashboard/coprahome"); // Adjust API path as needed
            const { revenue } = response.data;
            console.log("revenue", revenue);

            // Update chart data and summary
            setChartData({
                expense_revenue: {
                    labels: revenue.labels, // ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
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

    useEffect(() => {
        fetchRevenueData(); // Fetch data when the component mounts
    }, []);

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
