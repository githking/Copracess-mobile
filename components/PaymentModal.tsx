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
  Linking,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // Make sure to import from the correct package
import PaymentNotFoundModal from "@/components/PaymentNotFoundModal";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import axios from "axios";
import { startBackgroundPolling, startPollingTask } from "@/services/polling";
import * as SecureStore from "expo-secure-store";
import {
  checkPaymentStatus,
  startBackgroundFetch,
} from "@/services/pollingPayment";

const PaymentModal: React.FC<PaymentModalProps> = ({
  visible,
  transaction,
  onConfirm,
  onClose,
}) => {
  if (!transaction) {
    return <PaymentNotFoundModal onClose={onClose} visible={visible} />;
  }

  const { authState } = useAuth();
  const isCopraOwner = authState?.data.role === "COPRA_BUYER";

  const [form, setForm] = useState({
    discount: 0,
    totalAmount: 0,
    remarks: transaction.remarks || "",
    paymentMethod: transaction.paymentType,
    plateNumber: transaction.plateNumber,
    transactionID: transaction.id,
  });

  const handleInputChange = (name: string, value: string) => {
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOnlinePayment = async () => {
    try {
      if (!form.transactionID || !form.paymentMethod || !form.totalAmount) {
        throw new Error("Incomplete form data");
      }

      const { data: invoiceResponse } = await axios.post("/transactions", {
        transactionID: form.transactionID,
        paymentMethod: form.paymentMethod,
        discount: form.discount,
        totalAmount: form.totalAmount,
        remarks: form.remarks,
        email: authState?.data.email,
      });

      console.log("Invoice creation successful:", invoiceResponse);

      if (
        !invoiceResponse ||
        !invoiceResponse.invoiceId ||
        !invoiceResponse.invoiceUrl
      ) {
        throw new Error("Missing invoice ID or invoice URL in the response");
      }

      const invoiceId: string = invoiceResponse.invoiceId;
      const invoiceUrl: string = invoiceResponse.invoiceUrl;

      await SecureStore.setItemAsync("invoiceID", invoiceId);

      const canOpen = await Linking.canOpenURL(invoiceUrl);
      if (canOpen) {
        await Linking.openURL(invoiceUrl);
      } else {
        throw new Error("Payment confirmation timed out.");
      }

      await startBackgroundFetch();

      onConfirm();
    } catch (error) {
      console.error("Payment confirmation failed:", error);
      Alert.alert(
        "Payment Error",
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmPayment = async () => {
    setIsSubmitting(true);
    handleOnlinePayment();
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
                        label="Online Payment"
                        value="Online Payment"
                      />
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

                <View className="space-y-4">
                  <CustomButton
                    title={isSubmitting ? "Processing..." : "Confirm"} // Update button text when submitting
                    handlePress={handleConfirmPayment}
                    containerStyles="mt-7"
                    isLoading={isSubmitting} // Pass loading state
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
