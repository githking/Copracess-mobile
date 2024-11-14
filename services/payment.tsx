// utils/paymentService.ts
import axios from "axios";
import { Alert, Linking } from "react-native";

export const handleOnlinePayment = async (
    form: any,
    authEmail: string,
    onConfirm: () => void,
    setIsSubmitting: (isSubmitting: boolean) => void
) => {
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
            email: authEmail,
        });

        console.log("Invoice creation successful:", invoiceResponse);

        if (
            !invoiceResponse ||
            !invoiceResponse.invoiceId ||
            !invoiceResponse.invoiceUrl
        ) {
            throw new Error(
                "Missing invoice ID or invoice URL in the response"
            );
        }

        const invoiceId: string = invoiceResponse.invoiceId;
        const invoiceUrl: string = invoiceResponse.invoiceUrl;

        const canOpen = await Linking.canOpenURL(invoiceUrl);
        if (canOpen) {
            await Linking.openURL(invoiceUrl);
        } else {
            throw new Error("Payment confirmation timed out.");
        }

        let attempts = 0;

        const pollPayment = async (): Promise<boolean> => {
            const isPaid = await axios.get(
                `/transactions/status?invoiceID=${invoiceId}`
            );

            if (isPaid.data.success) {
                const responseUpdate = await axios.put(
                    `/transactions?invoiceID=${invoiceId}`,
                    form
                );

                if ("error" in responseUpdate) {
                    Alert.alert("Failed to update transaction after payment.");
                    return false;
                }

                console.log("ISPAID::", isPaid.data.message);
                return true;
            }

            return false;
        };

        await pollPayment();
        onConfirm();
    } catch (error) {
        console.error("Payment confirmation failed:", error);
        Alert.alert(
            "Payment Error",
            error instanceof Error
                ? error.message
                : "An unexpected error occurred."
        );
    } finally {
        setIsSubmitting(false);
    }
};

export const handleCashPayment = async (
    form: any,
    authEmail: string,
    onConfirm: () => void,
    setIsSubmitting: (isSubmitting: boolean) => void
) => {
    try {
        if (!form.transactionID || !form.paymentMethod || !form.totalAmount) {
            throw new Error("Incomplete form data");
        }

        const responseUpdate = await axios.put(
            `/transactions?invoiceID=""`,
            form
        );

        if ("error" in responseUpdate) {
            throw new Error("Failed to update transaction after payment.");
        }

        onConfirm();
    } catch (error) {
        console.error("Payment confirmation failed:", error);
        Alert.alert(
            "Payment Error",
            error instanceof Error
                ? error.message
                : "An unexpected error occurred."
        );
    } finally {
        setIsSubmitting(false);
    }
};
