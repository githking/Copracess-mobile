import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { formatCurrency } from "react-native-format-currency";
import { icons } from "@/constants";

import type { CopraOwnerTransaction, OilmillTransaction, TransactionCardProps } from "@/types/type";
import { useAuth } from "@/context/AuthContext";

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction, isEditMode, onPress }) => {
    const { authState } = useAuth();
    const [value] = formatCurrency({
        amount: Number(transaction.totalAmount),
        code: "PHP",
    });
    const isPaid = transaction.status === "COMPLETED" || transaction.status === "CLAIMED";

    const isCopraOwner = authState?.data.role === "COPRA_BUYER";

    if (isCopraOwner) {
        return (
            <TouchableOpacity
                onPress={() => onPress()}
                disabled={isPaid}
                className={`border-2 ${
                    isEditMode ? "border-secondary" : "border-primary"
                } bg-white p-4 rounded-lg shadow-sm shadow-gray-200 mb-3`}>
                <View className="flex-row justify-between items-center mb-2">
                    <Text className="font-pregular text-xs text-gray-100">
                        CREATED: {transaction.date} {transaction.time}
                    </Text>
                    <Text className="font-psemibold text-primary text-lg text-green-600">
                        {value}
                    </Text>
                </View>
                <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-xl font-psemibold">
                        {isCopraOwner
                            ? (transaction as CopraOwnerTransaction).oilMillCompanyName
                            : (transaction as OilmillTransaction).copraOwnerName}
                    </Text>
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
                        <Text className="font-psemibold">{transaction.plateNumber}</Text>
                    </View>
                    <View className="flex-2 border-r-2 border-r-gray-200 ml-2">
                        <Text className="font-psemibold text-sm text-primary pr-2">WEIGHT</Text>
                        <Text className="font-psemibold">
                            {transaction.booking.estimatedWeight} tons
                        </Text>
                    </View>
                    <View className="flex-2 border-r-gray-200 ml-2">
                        <Text className="font-psemibold text-sm text-primary">PAYMENT METHOD</Text>
                        <Text className="font-psemibold">{transaction.paymentType}</Text>
                    </View>
                </View>
                <View className="mt-2 self-start">
                    <TouchableOpacity
                        disabled={isPaid}
                        className={`mt-2 px-2 py-1 rounded self-start ${
                            isPaid ? "bg-gray-100" : "bg-secondary"
                        }`}>
                        <Text
                            className={`text-xs font-medium ${
                                isPaid ? "text-gray-200" : "text-white"
                            }`}>
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
    }

    return (
        <TouchableOpacity
            onPress={() => onPress()}
            disabled={isPaid}
            className={`border-2 ${
                isEditMode ? "border-secondary" : "border-primary"
            } bg-white p-4 rounded-lg shadow-sm shadow-gray-200 mb-3`}>
            <View className="flex-row justify-between items-center mb-2">
                <Text className="font-pregular text-xs text-gray-100">
                    CREATED: {transaction.date} {transaction.time}
                </Text>
                <Text className="font-psemibold text-primary text-lg text-green-600">{value}</Text>
            </View>
            <View className="flex-row justify-between items-center mb-2">
                <Text className="text-xl font-psemibold">
                    {isCopraOwner
                        ? (transaction as CopraOwnerTransaction).oilMillCompanyName
                        : (transaction as OilmillTransaction).copraOwnerName}
                </Text>
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
                    <Text className="font-psemibold text-sm text-primary pr-2">PLATE NUMBER</Text>
                    <Text className="font-psemibold">{transaction.plateNumber}</Text>
                </View>
                <View className="flex-2 border-r-2 border-r-gray-200 ml-2">
                    <Text className="font-psemibold text-sm text-primary pr-2">WEIGHT</Text>
                    <Text className="font-psemibold">
                        {transaction.booking.estimatedWeight} tons
                    </Text>
                </View>
                <View className="flex-2 border-r-gray-200 ml-2">
                    <Text className="font-psemibold text-sm text-primary">PAYMENT METHOD</Text>
                    <Text className="font-psemibold">{transaction.paymentType}</Text>
                </View>
            </View>
            <View className="mt-2 self-start">
                <TouchableOpacity
                    disabled={isPaid}
                    className={`mt-2 px-2 py-1 rounded self-start ${
                        isPaid ? "bg-gray-100" : "bg-secondary"
                    }`}>
                    <Text
                        className={`text-xs font-medium ${
                            isPaid ? "text-gray-200" : "text-white"
                        }`}>
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
