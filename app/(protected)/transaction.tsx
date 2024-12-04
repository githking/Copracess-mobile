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
import type {
  Filters,
  OilmillTransaction,
  CopraOwnerTransaction,
} from "@/types/type";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import PaymentModal from "@/components/PaymentModal";
import ClaimModal from "@/components/ClaimModal";

const Transaction = () => {
  const { authState } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [transactions, setTransactions] = useState<
    Array<OilmillTransaction | CopraOwnerTransaction>
  >([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Array<OilmillTransaction | CopraOwnerTransaction>
  >([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<
    OilmillTransaction | CopraOwnerTransaction | null
  >(null);
  const [isBuyerModalVisible, setIsBuyerModalVisible] = useState(false);

  useEffect(() => {
    setFilteredTransactions(transactions);
  }, [transactions]);

  const fetchTransactions = async () => {
    if (!authState?.accessToken) {
      console.log("No access token available");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("/transactions");
      console.log("Transaction fetch successful", {
        status: response.status,
        dataLength: response.data?.transactions?.length,
      });
      setTransactions(response.data.transactions || []);
    } catch (error: any) {
      console.error("Transaction fetch error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        headers: error.config?.headers,
      });

      if (error.response?.status !== 401) {
        setRefreshing(false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authState?.authenticated && authState?.accessToken) {
      fetchTransactions();
    }
  }, [authState?.accessToken, authState?.authenticated]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTransactions();
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredTransactions(transactions);
      return;
    }

    const searchTerm = query.toLowerCase();
    const filtered = transactions.filter((transaction) => {
      // Create utility function to safely get names based on transaction type
      const getTransactionName = (
        tx: OilmillTransaction | CopraOwnerTransaction
      ) => {
        if ("copraOwner" in tx) {
          // OilmillTransaction
          return tx.copraOwner.name;
        } else {
          // CopraOwnerTransaction
          return tx.oilMillCompany.name;
        }
      };

      const searchableFields = {
        id: transaction.id || "",
        plateNumber: transaction.plateNumber || "",
        status: transaction.status || "",
        name: getTransactionName(transaction),
        weight: String(transaction.booking?.estimatedWeight || ""),
        paymentType: transaction.paymentType || "",
      };

      return Object.values(searchableFields).some((value) =>
        String(value).toLowerCase().includes(searchTerm)
      );
    });

    setFilteredTransactions(filtered);
  };
  const handleOpenFilterModal = () => setIsFilterModalVisible(true);
  const handleCloseFilterModal = () => setIsFilterModalVisible(false);

  const handleApplyFilters = (filters: Filters) => {
    console.log("Filters applied:", filters);
    // Implement filter logic here
    handleCloseFilterModal();
  };

  const handleTransactionPress = (
    transaction: OilmillTransaction | CopraOwnerTransaction
  ) => {
    setSelectedTransaction(transaction);
    if (authState?.data.role === "COPRA_BUYER") {
      setIsBuyerModalVisible(true);
    } else {
      setIsModalVisible(true);
    }
  };

  const handleConfirmPayment = () => {
    setIsModalVisible(false);
    setIsBuyerModalVisible(false);
    fetchTransactions(); // Refresh after payment
  };

  const renderHeader = () => (
    <View className="pt-4">
      <View className="flex flex-row items-center space-x-2 w-full">
        <View className="flex-1 flex-row items-center">
          <SearchInput icon={icons.search} onSearch={handleSearch} />
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
  );

  const renderEmpty = () => (
    <View className="flex flex-col items-center justify-center">
      {!loading ? (
        <>
          <Image
            source={images.empty}
            className="w-40 h-40"
            alt="No transaction found"
            resizeMode="contain"
          />
          <Text className="text-sm">No transaction found</Text>
        </>
      ) : (
        <ActivityIndicator size="small" color="#59A60E" />
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-off-100">
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TransactionCard
            transaction={item}
            isEditMode={false}
            onPress={() => handleTransactionPress(item)}
          />
        )}
        refreshControl={
          <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
        }
        className="px-4 pb-24"
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={renderEmpty}
        ListHeaderComponent={renderHeader}
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

export default Transaction;
