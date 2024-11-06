// app/(protected)/transaction.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { useTransactions } from "@/services/transaction/hooks";
import TransactionCard from "@/components/transactionCard";
import SearchInput from "@/components/SearchInput";
import FilterModal from "@/components/FilterModal";
import { images, icons } from "@/constants";
import type {
  Filters,
  OilmillTransaction,
  CopraOwnerTransaction,
} from "@/types/type";
import { useAuth } from "@/context/AuthContext";
import Loading from "@/components/loadings";

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 96,
  },
});

const TransactionScreen = () => {
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { transactions, loading, refreshing, error, refresh, updateFilters } =
    useTransactions();

  // Filter Handlers
  const handleOpenFilterModal = () => setIsFilterModalVisible(true);
  const handleCloseFilterModal = () => setIsFilterModalVisible(false);
  const handleApplyFilters = (filters: Filters) => {
    updateFilters(filters);
    handleCloseFilterModal();
  };

  if (loading) {
    return <Loading variant="fullscreen" message="Loading transactions..." />;
  }

  // Search Handler
  const handleSearch = () => {
    updateFilters({ searchQuery });
  };

  const ErrorDisplay = () => (
    <View className="flex flex-col items-center justify-center p-4">
      <Text className="text-red-500 font-pmedium text-center mb-2">
        {error}
      </Text>
      <TouchableOpacity
        className="bg-primary px-4 py-2 rounded-lg"
        onPress={refresh}
      >
        <Text className="text-white font-pmedium">Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  const EmptyListComponent = () => (
    <View className="flex flex-col items-center justify-center py-10">
      {!loading ? (
        <>
          <Image
            source={images.empty}
            className="w-40 h-40"
            resizeMode="contain"
          />
          <Text className="text-gray-100 font-pmedium mt-4">
            No transactions found
          </Text>
        </>
      ) : (
        <ActivityIndicator size="large" color="#59A60E" />
      )}
    </View>
  );

  const HeaderComponent = () => (
    <View className="pt-4">
      <View className="flex flex-row items-center space-x-2 w-full">
        <View className="flex-1">
          <SearchInput
            icon={icons.search}
            handlePress={handleSearch}
            initialQuery={searchQuery}
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
        <Text className="text-primary text-3xl font-pbold">Transactions</Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-off-100">
      {error && <ErrorDisplay />}

      <FlatList<OilmillTransaction | CopraOwnerTransaction>
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TransactionCard
            transaction={item}
            isEditMode={false}
            onPress={() => {}}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            colors={["#59A60E"]}
            tintColor="#59A60E"
          />
        }
        contentContainerStyle={styles.contentContainer}
        ListEmptyComponent={EmptyListComponent}
        ListHeaderComponent={HeaderComponent}
        onEndReachedThreshold={0.5}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />

      <FilterModal
        visible={isFilterModalVisible}
        onClose={handleCloseFilterModal}
        onApplyFilters={handleApplyFilters}
      />
    </View>
  );
};

export default TransactionScreen;
