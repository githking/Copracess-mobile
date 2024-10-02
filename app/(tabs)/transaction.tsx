import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { images } from "../../constants";
import { icons } from "../../constants";
import FAB from "react-native-fab";

import TransactionCard from "../../components/transactionCard";
import GoogleTextInput from "../../components/GoogleTextInput";

const transactions = [
  {
    transaction_id: "1",
    transaction_date_time: "2024-08-12 05:19:20",
    buyer_name: "Hakim Saricala",
    transaction_amount: "140000.00",
    plate_number: "ABC123",
    copra_weight: 8,
    payment_method: "Bank",
    status: "Paid",
  },
  {
    transaction_id: "2",
    transaction_date_time: "2024-08-12 05:19:20",
    buyer_name: "King Baltazar",
    transaction_amount: "24000.00",
    plate_number: "JAB789",
    copra_weight: 2,
    payment_method: "Cash",
    status: "Pending",
  },
  {
    transaction_id: "3",
    transaction_date_time: "2024-09-12 05:19:20",
    buyer_name: "Lester David",
    transaction_amount: "170000.00",
    plate_number: "KYU119",
    copra_weight: 10,
    payment_method: "Cheque",
    status: "Paid",
  },
];

const transaction = () => {
  const loading = false;
  const handleDestinationPress = () => {};
  return (
    <SafeAreaView className="bg-off-100">
      <FlatList
        data={transactions}
        className="p-4"
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View>
            <TransactionCard transaction={item} />
          </View>
        )}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={() => (
          <View className="flex flex-col items-center justify-center">
            {!loading ? (
              <>
                <Image
                  source={images.empty}
                  className="w-40 h-40 "
                  alt="No transaction found"
                  resizeMode="contain"
                />
                <Text className="text-sm">No transaction found</Text>
              </>
            ) : (
              <ActivityIndicator size="small" color="#59A60E" />
            )}
          </View>
        )}
        ListHeaderComponent={() => (
          <>
            <GoogleTextInput
              icon={icons.search}
              containerStyles="bg-white shadow-md shadow-gray-100"
              handlePress={handleDestinationPress}
            />
            <View className="flex flex-row items-start justify-between my-5">
              <Text className="flex-1 text-primary text-3xl font-pbold ">
                Transaction
              </Text>
              <TouchableOpacity>
                <Text className="flex-2 text-lg font-pmedium text-primary">
                  Edit
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      />
    </SafeAreaView>
  );
};

export default transaction;
