import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import type { AddTransactionModalProps } from "../types/type";

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  visible,
  onClose,
}) => {
  const [owner, setOwner] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [quality, setQuality] = useState("");
  const [weight, setWeight] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = () => {
    onClose();
  };

  const onDateChange = (_: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setPaymentDate(selectedDate);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/50 justify-center items-center p-4">
        <View className="bg-white rounded-lg p-6 w-full max-w-md">
          <View className="flex-row flex-wrap -mx-2">
            <View className="w-1/2 px-2 mb-4">
              <Text className="text-sm font-psemibold text-black mb-1">
                Copra owner
              </Text>
              <TextInput
                value={owner}
                onChangeText={setOwner}
                placeholder="Name"
                className="w-full p-2 border border-primary rounded-md"
              />
            </View>

            <View className="w-1/2 px-2 mb-4">
              <Text className="text-sm font-psemibold text-black mb-1">
                Plate number
              </Text>
              <TextInput
                value={plateNumber}
                onChangeText={setPlateNumber}
                placeholder="Plate number"
                className="w-full p-2 border border-primary rounded-md"
              />
            </View>

            <View className="w-1/2 px-2 mb-4">
              <Text className="text-sm font-psemibold text-black mb-1">
                Amount
              </Text>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder="₱"
                keyboardType="numeric"
                className="w-full p-2 border border-primary rounded-md"
              />
            </View>

            <View className="w-1/2 px-2 mb-4">
              <Text className="text-sm font-psemibold text-black mb-1">
                Quality
              </Text>
              <TextInput
                value={quality}
                onChangeText={setQuality}
                placeholder="Select Type"
                className="w-full p-2 border border-primary rounded-md"
              />
            </View>

            <View className="w-1/2 px-2 mb-4">
              <Text className="text-sm font-psemibold text-black mb-1">
                Weight
              </Text>
              <TextInput
                value={weight}
                onChangeText={setWeight}
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
                <Text>{paymentDate.toDateString()}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            className="w-full bg-primary rounded-md py-2 mt-4"
          >
            <Text className="text-white font-psemibold text-center">
              ADD TRANSACTION
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
          value={paymentDate}
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

export default AddTransactionModal;
