import CustomButton from "@/components/CustomButton";
import PaymentNotFoundModal from "@/components/PaymentNotFoundModal";
import { useAuth } from "@/context/AuthContext";
import { PaymentModalProps } from "@/types/type";
import { useState, useEffect } from "react";
import {
    Alert,
    Modal,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";

interface PaymentMethod {
    id: string;
    channelCode: string;
    accountNumber: string;
}

const ClaimModal: React.FC<PaymentModalProps> = ({
    visible,
    transaction,
    onConfirm,
    onClose,
}) => {
    if (!transaction) {
        return <PaymentNotFoundModal onClose={onClose} visible={visible} />;
    }

    const { authState } = useAuth();
    const [form, setForm] = useState({
        discount: 0,
        totalAmount: transaction.totalAmount,
        paymentMethod: transaction.paymentType,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("CASH");
    const [isOnlinePayment, setIsOnlinePayment] = useState(false);

    useEffect(() => {
        if (visible) {
            fetchPaymentMethods();
        }
    }, [visible]);

    const fetchPaymentMethods = async () => {
        try {
            const response = await axios.get(`/transactions/payment`);
            console.log("Payment Methods:", response.data);
            setPaymentMethods(response.data.methods || []);
        } catch (error) {
            console.error("Error fetching payment methods:", error);
            alert("Failed to load payment methods. Please try again.");
        }
    };

    const handleInputChange = (name: string, value: string) => {
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const handleConfirmPayment = async () => {
        setIsSubmitting(true);

        try {
            if (isOnlinePayment) {
                const response = await axios.post(
                    `/transactions/payment?transactionID=${transaction.id}`
                );

                if (response.data.payoutResponse?.status === "ACCEPTED") {
                    console.log("ACCEPTED");

                    await axios.put(
                        `/transactions/payment?transactionID=${transaction.id}&payoutID=${response.data.payoutResponse.id}`
                    );
                    console.log("ACCEPTED");

                    Alert.alert("Success online payout!!");
                }
            } else {
                await axios.put(
                    `/transactions/payment?transactionID=${transaction.id}`
                );
                Alert.alert("Success cash payout!!");
            }
        } catch (error) {
            console.error(error);
        }

        onConfirm();
        setIsSubmitting(false);
    };

    const handlePaymentMethodChange = (method: string) => {
        setSelectedPaymentMethod(method);
        setIsOnlinePayment(method === "ONLINE_PAYMENT");
        handleInputChange("paymentMethod", method);
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <TouchableWithoutFeedback onPress={onClose}>
                <View className="flex-1 bg-black/50 justify-center items-center">
                    <TouchableWithoutFeedback>
                        <View className="bg-white rounded-lg p-6 w-full max-w-md">
                            <Text className="text-lg font-bold mb-4">
                                Copra Buyer Payment
                            </Text>

                            <Text>Plate Number: {transaction.plateNumber}</Text>
                            <Text>
                                Total Amount: {transaction.totalAmount} PHP
                            </Text>

                            <View className="flex-row justify-between mt-4">
                                <CustomButton
                                    title="Claim with Cash"
                                    handlePress={() =>
                                        handlePaymentMethodChange("CASH")
                                    }
                                    containerStyles={`w-1/2 mr-2 ${
                                        selectedPaymentMethod === "CASH"
                                            ? "bg-primary"
                                            : "bg-gray-200"
                                    }`}
                                    textStyles={
                                        selectedPaymentMethod === "CASH"
                                            ? "text-white"
                                            : "text-black"
                                    }
                                    isLoading={isSubmitting}
                                />
                                <CustomButton
                                    title="Claim Online"
                                    handlePress={() =>
                                        handlePaymentMethodChange(
                                            "ONLINE_PAYMENT"
                                        )
                                    }
                                    containerStyles={`w-1/2 ${
                                        selectedPaymentMethod ===
                                        "ONLINE_PAYMENT"
                                            ? "bg-primary"
                                            : "bg-gray-200"
                                    }`}
                                    textStyles={
                                        selectedPaymentMethod ===
                                        "ONLINE_PAYMENT"
                                            ? "text-white"
                                            : "text-black"
                                    }
                                    isLoading={isSubmitting}
                                />
                            </View>

                            {isOnlinePayment && paymentMethods.length > 0 && (
                                <View className="mt-4">
                                    <Text className="text-base text-black font-medium">
                                        Select Online Payment Method
                                    </Text>
                                    <Picker
                                        selectedValue={form.paymentMethod}
                                        onValueChange={(itemValue) => {
                                            handleInputChange(
                                                "paymentMethod",
                                                itemValue
                                            );
                                        }}
                                        style={{ width: "100%", height: 50 }}
                                    >
                                        {paymentMethods.map((method, index) => (
                                            <Picker.Item
                                                key={index}
                                                label={`${method.channelCode} - ${method.accountNumber}`}
                                                value={method.id}
                                            />
                                        ))}
                                    </Picker>
                                </View>
                            )}

                            <View className="space-y-4 mt-4">
                                <CustomButton
                                    title={
                                        isSubmitting
                                            ? "Processing..."
                                            : "Confirm"
                                    }
                                    handlePress={handleConfirmPayment}
                                    containerStyles="mt-4"
                                    isLoading={isSubmitting}
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
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default ClaimModal;
