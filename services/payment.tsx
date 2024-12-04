// utils/paymentService.ts
import axios from "axios";
import { Alert, Linking } from "react-native";

// payment.tsx
export const handleCashPayment = async (
  form: any,
  authEmail: string,
  onConfirm: () => void,
  setIsSubmitting: (isSubmitting: boolean) => void
) => {
  try {
    if (!form.transactionID) {
      throw new Error("Missing transaction ID");
    }

    await axios.put(
      `/transactions/payment?transactionID=${form.transactionID}`
    );

    onConfirm();
  } catch (error) {
    console.error("Payment failed:", error);
    Alert.alert(
      "Payment Error",
      error instanceof Error ? error.message : "Payment processing failed"
    );
  } finally {
    setIsSubmitting(false);
  }
};

export const handleOnlinePayment = async (
  form: any,
  authEmail: string,
  onConfirm: () => void,
  setIsSubmitting: (isSubmitting: boolean) => void
) => {
  try {
    if (!form.transactionID) {
      throw new Error("Missing transaction ID");
    }

    const { data } = await axios.post(
      `/transactions/payment?transactionID=${form.transactionID}`
    );

    if (data.payoutResponse?.status === "ACCEPTED") {
      await axios.put(
        `/transactions/payment?transactionID=${form.transactionID}&payoutID=${data.payoutResponse.id}`
      );
    } else {
      throw new Error("Payout not accepted");
    }

    onConfirm();
  } catch (error) {
    console.error("Payment failed:", error);
    Alert.alert(
      "Payment Error",
      error instanceof Error ? error.message : "Payment processing failed"
    );
  } finally {
    setIsSubmitting(false);
  }
};
