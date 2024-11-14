import {
    View,
    Text,
    FlatList,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { images } from "@/constants";
import { icons } from "@/constants";
import TransactionCard from "@/components/transactionCard";
import SearchInput from "@/components/SearchInput";
import FilterModal from "@/components/FilterModal";
import type { Filters } from "@/types/type";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import PaymentModal from "@/components/PaymentModal";
import ClaimModal from "@/components/ClaimModal";

const transaction = () => {
    const { authState } = useAuth();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const [transactions, setTransactions] = useState<any[]>([]);

    const fetchTransactions = async () => {
        if (!authState?.accessToken) {
            console.log("No access token available");
            setLoading(false);
            return;
        }

        try {
            // Don't set the header manually here, let the interceptor handle it
            const response = await axios.get("/transactions");

            console.log("Transaction fetch successful", {
                status: response.status,
                dataLength: response.data?.transactions?.length,
            });

            setTransactions(response.data.transactions);
        } catch (error: any) {
            console.error("Transaction fetch error:", {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
                headers: error.config?.headers,
            });

            if (error.response?.status !== 401) {
                setLoading(false);
                setRefreshing(false);
            }
        }
    };

    useEffect(() => {
        if (authState?.authenticated && authState?.accessToken) {
            console.log("Auth state triggered transaction fetch", {
                authenticated: authState.authenticated,
                hasToken: !!authState.accessToken,
            });
            fetchTransactions();
        }
    }, [authState?.accessToken, authState?.authenticated]);

    const onRefresh = () => {
        console.log("Manual refresh triggered");
        setRefreshing(true);
        fetchTransactions();
    };

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

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [isBuyerModalVisible, setIsBuyerModalVisible] = useState(false);

    const handleTransactionPress = (transaction: any) => {
        setSelectedTransaction(transaction);

        // Open a specific modal depending on the user role
        if (authState?.data.role === "COPRA_BUYER") {
            setIsBuyerModalVisible(true); // Show modal for Copra Buyer
        } else {
            setIsModalVisible(true); // Show the default modal
        }

        console.log("Transaction clicked:", transaction);
    };

    const handleConfirmPayment = () => {
        setIsModalVisible(false);
        setIsBuyerModalVisible(false);
        console.log("Confirm");
    };

    return (
        <View className="flex-1 bg-off-100">
            <FlatList
                data={transactions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TransactionCard
                        transaction={item}
                        isEditMode={false}
                        onPress={(transaction) =>
                            handleTransactionPress(transaction)
                        }
                    />
                )}
                refreshControl={
                    <RefreshControl
                        onRefresh={onRefresh}
                        refreshing={refreshing}
                    />
                }
                className="px-4 pb-24"
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={() => (
                    <View className="flex flex-col items-center justify-center">
                        {!loading ? (
                            <>
                                <Image
                                    source={images.empty}
                                    className="w-40 h-40"
                                    alt="No transaction found"
                                    resizeMode="contain"
                                />
                                <Text className="text-sm">
                                    No transaction found
                                </Text>
                            </>
                        ) : (
                            <ActivityIndicator size="small" color="#59A60E" />
                        )}
                    </View>
                )}
                ListHeaderComponent={() => (
                    <View className="pt-4">
                        <View className="flex flex-row items-center space-x-2 w-full">
                            <View className="flex-1 flex-row items-center">
                                <SearchInput
                                    icon={icons.search}
                                    handlePress={() => {}}
                                />
                            </View>
                            <TouchableOpacity
                                className="p-1.5 border border-primary bg-white rounded-md"
                                onPress={handleOpenFilterModal}
                            >
                                <Image
                                    source={icons.filter}
                                    className="w-7 h-7"
                                    style={{ tintColor: "#59A60E" }}
                                />
                            </TouchableOpacity>
                        </View>
                        <View className="my-5">
                            <Text className="text-primary text-3xl font-pbold">
                                Transaction History
                            </Text>
                        </View>
                    </View>
                )}
            />

            <PaymentModal
                visible={isModalVisible}
                transaction={selectedTransaction}
                onConfirm={handleConfirmPayment}
                onClose={() => setIsModalVisible(false)}
            />

            <ClaimModal
                visible={isBuyerModalVisible}
                transaction={selectedTransaction}
                onConfirm={handleConfirmPayment}
                onClose={() => setIsBuyerModalVisible(false)}
            />

            <FilterModal
                visible={isFilterModalVisible}
                onClose={handleCloseFilterModal}
                onApplyFilters={handleApplyFilters}
            />
        </View>
    );
};

export default transaction;
