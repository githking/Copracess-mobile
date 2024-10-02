import { View, Text, TouchableOpacity } from "react-native";
import transaction from "./../app/(tabs)/transaction";
import { formatCurrency } from "react-native-format-currency";

import { Transaction } from "../types/type";

const TransactionCard = ({ transaction }: { transaction: Transaction }) => {
  const [value] = formatCurrency({
    amount: Number(transaction.transaction_amount),
    code: "PHP",
  });
  const isPaid = transaction.status === "Paid";

  return (
    <View className="border-2 border-primary bg-white p-4 rounded-lg shadow-sm shadow-gray-200 mb-3">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="font-pregular text-xs text-gray-100">
          CREATED: {transaction.transaction_date_time}
        </Text>
        <Text className="font-psemibold text-primary text-lg text-green-600">
          {value}
        </Text>
      </View>
      <Text className="text-xl font-psemibold mb-2">
        {transaction.buyer_name}
      </Text>
      <View className="flex-row justify-between">
        <View className="flex-2 border-r-2  border-r-gray-200  ml-2">
          <Text className="font-psemibold text-sm text-primary pr-2">
            PLATE NUMBER
          </Text>
          <Text className="font-psemibold">{transaction.plate_number}</Text>
        </View>
        <View className="flex-2 border-r-2 border-r-gray-200  ml-2">
          <Text className="font-psemibold text-sm text-primary pr-2">
            WEIGHT
          </Text>
          <Text className="font-psemibold">
            {transaction.copra_weight} tons
          </Text>
        </View>
        <View className="flex-2  border-r-gray-200  ml-2">
          <Text className="font-psemibold text-sm text-primary">
            PAYMENT METHOD
          </Text>
          <Text className="font-psemibold">{transaction.payment_method}</Text>
        </View>
      </View>
      <View className="mt-2 bg-blue-100 self-start px-2 py-1 rounded">
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
    </View>
  );
};

export default TransactionCard;
