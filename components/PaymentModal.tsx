import { useAuth } from "@/context/AuthContext";
import {
  CopraOwnerTransaction,
  OilmillTransaction,
  PaymentModalProps,
} from "@/types/type";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // Make sure to import from the correct package
import PaymentNotFoundModal from "@/components/PaymentNotFoundModal";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";

const PaymentModal: React.FC<PaymentModalProps> = ({
  visible,
  transaction,
  onConfirm,
  onClose,
}) => {
  // Early return if no transaction
  if (!transaction) {
    return <PaymentNotFoundModal onClose={onClose} visible={visible} />;
  }

  const { authState } = useAuth();
  const isCopraOwner = authState?.data.role === "COPRA_BUYER";

  // Local form state to manage inputs
  const [form, setForm] = useState({
    discount: 0, // Initialize discount field
    totalAmount: 0,
    remarks: transaction.remarks || "",
    paymentMethod: transaction.paymentType,
    plateNumber: transaction.plateNumber,
  });

  // Update form state when any input changes
  const handleInputChange = (name: string, value: string) => {
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // Handle discount input change (if needed for calculation or validation)
  const handleDiscountChange = (value: string) => {
    const discountValue = parseFloat(value);
    if (!isNaN(discountValue)) {
      setForm((prevForm) => ({
        ...prevForm,
        discount: discountValue,
      }));
    }
  };

  const handleTotalAmountChange = (value: string) => {
    const amountValue = parseFloat(value);
    if (!isNaN(amountValue)) {
      setForm((prevForm) => ({
        ...prevForm,
        totalAmount: amountValue,
      }));
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <ScrollView className="pb-20">
          <View className="flex-1 bg-black/50 justify-center items-center p-4">
            <TouchableWithoutFeedback>
              <View className="bg-white rounded-lg p-6 w-full max-w-md">
                {/* Scrollable content */}
                <Text className="text-lg font-bold mb-4">Confirm Payment</Text>
                <Text>
                  Owner:{" "}
                  {isCopraOwner
                    ? (transaction as CopraOwnerTransaction).oilMillCompanyName
                    : (transaction as OilmillTransaction).copraOwnerName}
                </Text>
                <Text>Plate Number: {transaction?.plateNumber}</Text>
                <Text>Amount: {transaction?.totalAmount} PHP</Text>

                {/* Plate Number Input (disabled) */}
                <FormField
                  title="Plate Number"
                  value={form.plateNumber}
                  handleChangeText={() => {}}
                  placeholder="Plate number"
                  otherStyles="mt-2"
                  editable={false}
                />

                {/* Payment Method Select */}
                <View className="mt-4">
                  <Text className="text-base text-black font-pmedium">
                    Payment Method
                  </Text>
                  <View className="mt-2 w-full h-16 px-4 bg-white rounded-2xl border-2 border-primary focus:border-secondary">
                    <Picker
                      selectedValue={form.paymentMethod}
                      onValueChange={(itemValue) =>
                        handleInputChange("paymentMethod", itemValue)
                      }
                    >
                      <Picker.Item label="Cash" value="Cash" />
                      <Picker.Item
                        label="Bank Transfer"
                        value="Bank Transfer"
                      />
                      <Picker.Item
                        label="Online Payment"
                        value="Online Payment"
                      />
                      <Picker.Item label="Cheque" value="Cheque" />
                    </Picker>
                  </View>
                </View>

                {/* Discount Input */}
                <FormField
                  title="Discount"
                  value={String(form.discount)}
                  handleChangeText={handleDiscountChange}
                  keyboardType="numeric"
                  otherStyles="mt-2"
                  placeholder="Enter discount"
                />

                {/* Total Amount Input (disabled) */}
                <FormField
                  title="Total Amount"
                  value={String(form.totalAmount)}
                  handleChangeText={handleTotalAmountChange}
                  placeholder="Total amount"
                  otherStyles="mt-2"
                  keyboardType="numeric"
                />

                {/* Remarks Input */}
                <FormField
                  title="Remarks"
                  value={form.remarks}
                  handleChangeText={(text) =>
                    handleInputChange("remarks", text)
                  }
                  placeholder="Enter remarks"
                  otherStyles="mt-2"
                />

                {/* Action Buttons */}
                <View className="space-y-4">
                  <CustomButton
                    title="Confirm"
                    handlePress={onConfirm}
                    containerStyles="mt-7"
                    isLoading={false}
                  />

                  <TouchableOpacity
                    onPress={onClose}
                    className="w-full bg-gray-500 rounded-lg py-3 mt-4"
                  >
                    <Text className="text-white font-pbold text-center">
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default PaymentModal;
