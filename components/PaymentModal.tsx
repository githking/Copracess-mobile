import { useAuth } from "@/context/AuthContext";
import {
  CopraOwnerTransaction,
  OilmillTransaction,
  PaymentModalProps,
} from "@/types/type";
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";

const PaymentModal: React.FC<PaymentModalProps> = ({
  visible,
  transaction,
  onConfirm,
  onClose,
}) => {
  const { authState } = useAuth();

  const isCopraOwner = authState?.data.role === "COPRA_BUYER";

  if (!transaction) {
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
                <Text className="text-white font-pbold text-center ">
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
  return (
    <>
      <Modal visible={visible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={onClose}>
          <View className="flex-1 bg-black/50 justify-center items-center p-4">
            <TouchableWithoutFeedback>
              <View className="bg-white rounded-lg p-6 w-full max-w-md">
                <Text className="text-lg font-bold mb-4">Confirm Payment</Text>
                <Text>
                  Owner:
                  {isCopraOwner
                    ? (transaction as CopraOwnerTransaction).oilMillCompanyName
                    : (transaction as OilmillTransaction).copraOwnerName}
                </Text>
                <Text>Plate Number: {transaction?.plateNumber}</Text>
                <Text>Amount: {transaction?.totalAmount} PHP</Text>

                <TouchableOpacity
                  onPress={onConfirm}
                  className="w-full bg-green-500 rounded-lg py-3 mt-4 bg-primary"
                >
                  <Text className="text-white font-pbold text-center ">
                    Confirm
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onClose}
                  className="w-full bg-green-500 rounded-lg py-3 mt-4 bg-primary"
                >
                  <Text className="text-white font-pbold text-center ">
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default PaymentModal;
