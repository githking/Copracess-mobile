import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import type { SetPriceModalProps } from "../types/type";

const SetPriceModal: React.FC<SetPriceModalProps> = ({
  visible,
  onClose,
  onSetPrice,
  selectedDate,
}) => {
  const [price, setPrice] = useState("");

  const handleSetPrice = () => {
    onSetPrice(selectedDate, parseFloat(price));
    setPrice("");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable
        className="flex-1 justify-center items-center bg-black/30"
        onPress={onClose}
      >
        <Pressable
          className="bg-white p-6 rounded-2xl w-11/12 max-w-sm"
          onPress={(e) => e.stopPropagation()}
        >
          <Text className="text-xl font-pbold mb-4 text-primary">
            Set Price for {selectedDate}
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-4 text-lg font-pregular"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
            placeholder="Enter price"
            placeholderTextColor="#A0AEC0"
          />
          <View className="flex-row justify-end">
            <TouchableOpacity onPress={onClose} className="mr-4 py-2 px-4">
              <Text className="text-gray-600 font-psemibold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSetPrice}
              className="bg-primary py-2 px-4 rounded-lg"
            >
              <Text className="text-white font-pbold">Set Price</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default SetPriceModal;
