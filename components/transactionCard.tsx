import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { formatCurrency } from "react-native-format-currency";
import { Transaction } from "../types/type";
import { icons } from "../constants";

import type { TransactionCardProps } from "../types/type";

const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  isEditMode,
  onPress,
}) => {
  const [value] = formatCurrency({
    amount: Number(transaction.transaction_amount),
    code: "PHP",
  });
  const isPaid = transaction.status === "Paid";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!isEditMode}
      className={`border-2 ${
        isEditMode ? "border-secondary" : "border-primary"
      } bg-white p-4 rounded-lg shadow-sm shadow-gray-200 mb-3`}
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text className="font-pregular text-xs text-gray-100">
          CREATED: {transaction.transaction_date_time}
        </Text>
        <Text className="font-psemibold text-primary text-lg text-green-600">
          {value}
        </Text>
      </View>
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-xl font-psemibold">{transaction.buyer_name}</Text>
        {isEditMode && (
          <View className="bg-secondary rounded-full p-2">
            <Image
              source={icons.edit}
              className="w-4 h-4"
              style={{ tintColor: "white" }}
            />
          </View>
        )}
      </View>
      <View className="flex-row justify-between">
        <View className="flex-2 border-r-2 border-r-gray-200 ml-2">
          <Text className="font-psemibold text-sm text-primary pr-2">
            PLATE NUMBER
          </Text>
          <Text className="font-psemibold">{transaction.plate_number}</Text>
        </View>
        <View className="flex-2 border-r-2 border-r-gray-200 ml-2">
          <Text className="font-psemibold text-sm text-primary pr-2">
            WEIGHT
          </Text>
          <Text className="font-psemibold">
            {transaction.copra_weight} tons
          </Text>
        </View>
        <View className="flex-2 border-r-gray-200 ml-2">
          <Text className="font-psemibold text-sm text-primary">
            PAYMENT METHOD
          </Text>
          <Text className="font-psemibold">{transaction.payment_method}</Text>
        </View>
      </View>
      <View className="mt-2 self-start">
        <TouchableOpacity
          disabled={isPaid}
          className={`mt-2 px-2 py-1 rounded self-start ${
            isPaid ? "bg-gray-100" : "bg-secondary"
          }`}
        >
          <Text
            className={`text-xs font-medium ${
              isPaid ? "text-gray-200" : "text-white"
            }`}
          >
            {transaction.status.toUpperCase()}
          </Text>
        </TouchableOpacity>
      </View>
      {isEditMode && (
        <Text className="text-xs text-secondary mt-2 italic">
          Tap to edit this transaction
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default TransactionCard;
