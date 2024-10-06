import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import type { Transaction, UpdateTransactionModalProps } from "../types/type";

const UpdateTransactionModal: React.FC<UpdateTransactionModalProps> = ({
  visible,
  onClose,
  onUpdate,
  transaction,
}) => {
  const [updatedTransaction, setUpdatedTransaction] =
    useState<Transaction | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (transaction) {
      setUpdatedTransaction({ ...transaction });
    }
  }, [transaction]);

  const handleSubmit = () => {
    if (updatedTransaction) {
      onUpdate(updatedTransaction);
    }
  };

  const onDateChange = (_: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate && updatedTransaction) {
      setUpdatedTransaction({
        ...updatedTransaction,
        transaction_date_time: selectedDate.toISOString(),
      });
    }
  };

  if (!updatedTransaction) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/50 justify-center items-center p-4">
        <View className="bg-white rounded-lg p-6 w-full max-w-md">
          <Text className="text-xl font-pbold text-primary mb-4">
            Update Transaction
          </Text>
          <View className="flex-row flex-wrap -mx-2">
            <View className="w-1/2 px-2 mb-4">
              <Text className="text-sm font-psemibold text-black mb-1">
                Copra owner
              </Text>
              <TextInput
                value={updatedTransaction.buyer_name}
                onChangeText={(text) =>
                  setUpdatedTransaction({
                    ...updatedTransaction,
                    buyer_name: text,
                  })
                }
                placeholder="Name"
                className="w-full p-2 border border-primary rounded-md"
              />
            </View>

            <View className="w-1/2 px-2 mb-4">
              <Text className="text-sm font-psemibold text-black mb-1">
                Plate number
              </Text>
              <TextInput
                value={updatedTransaction.plate_number}
                onChangeText={(text) =>
                  setUpdatedTransaction({
                    ...updatedTransaction,
                    plate_number: text,
                  })
                }
                placeholder="Plate number"
                className="w-full p-2 border border-primary rounded-md"
              />
            </View>

            <View className="w-1/2 px-2 mb-4">
              <Text className="text-sm font-psemibold text-black mb-1">
                Amount
              </Text>
              <TextInput
                value={updatedTransaction.transaction_amount}
                onChangeText={(text) =>
                  setUpdatedTransaction({
                    ...updatedTransaction,
                    transaction_amount: text,
                  })
                }
                placeholder="₱"
                keyboardType="numeric"
                className="w-full p-2 border border-primary rounded-md"
              />
            </View>

            <View className="w-1/2 px-2 mb-4">
              <Text className="text-sm font-psemibold text-black mb-1">
                Weight
              </Text>
              <TextInput
                value={updatedTransaction.copra_weight.toString()}
                onChangeText={(text) =>
                  setUpdatedTransaction({
                    ...updatedTransaction,
                    copra_weight: Number(text),
                  })
                }
                placeholder="tons"
                keyboardType="numeric"
                className="w-full p-2 border border-primary rounded-md"
              />
            </View>

            <View className="w-1/2 px-2 mb-4">
              <Text className="text-sm font-psemibold text-black mb-1">
                Payment Date
              </Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className="w-full p-2 border border-primary rounded-md"
              >
                <Text>
                  {new Date(
                    updatedTransaction.transaction_date_time
                  ).toDateString()}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            className="w-full bg-primary rounded-md py-2 mt-4"
          >
            <Text className="text-white font-psemibold text-center">
              UPDATE TRANSACTION
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            className="w-full border border-primary rounded-md py-2 mt-2"
          >
            <Text className="text-primary font-psemibold text-center">
              CANCEL
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {showDatePicker && (
        <DateTimePicker
          value={new Date(updatedTransaction.transaction_date_time)}
          mode="date"
          display="default"
          onChange={onDateChange}
          themeVariant="dark"
          accentColor="#59A60E"
        />
      )}
    </Modal>
  );
};

export default UpdateTransactionModal;
