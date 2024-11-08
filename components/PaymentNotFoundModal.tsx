import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";

const PaymentNotFoundModal = ({ visible, onClose }: any) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <View className="bg-white rounded-lg p-6 w-full max-w-md">
            <Text className="text-lg font-bold mb-4">
              Transaction Not Found
            </Text>
            <Text>Unable to load transaction details.</Text>
            <TouchableOpacity
              onPress={onClose}
              className="w-full bg-red-500 rounded-lg py-3 mt-4"
            >
              <Text className="text-white font-pbold text-center">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default PaymentNotFoundModal;
