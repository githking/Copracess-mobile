import axios from "axios";
import { Alert } from "react-native";
import BackgroundService from "react-native-background-actions";

const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

const pollingTask = async (taskData?: { invoiceID: string }): Promise<void> => {
  if (!taskData || !taskData.invoiceID) {
    throw new Error("Invoice ID is required.");
  }

  const { invoiceID } = taskData;
  let attempts = 0;
  const maxAttempts = 5;
  const interval = 3000;

  try {
    while (attempts < maxAttempts) {
      const response = await axios.get(
        `/transactions/status?invoiceID=${invoiceID}`
      );

      console.log("attempts", attempts);

      const { success } = response.data;

      if (success) {
        return;
      }

      attempts++;
      await sleep(interval);
    }

    throw new Error("Payment confirmation timed out.");
  } catch (error) {
    console.error("Error during polling task:", error);
    throw error;
  }
};

export const startPollingTask = async (invoiceID: string) => {
  try {
    if (!BackgroundService) {
      throw new Error("BackgroundService is not available.");
    }
    console.log("BackgroundService:", BackgroundService);
    const options = {
      taskName: "Transaction Payment",
      taskTitle: "Waiting for payment....",
      taskDesc: "Your payment is still being processed.",
      taskIcon: {
        name: "ic_launcher",
        type: "mipmap",
      },
      color: "#ff00ff",
      parameters: {
        invoiceID: invoiceID,
      },
    };

    console.log("Starting background service...");
    await BackgroundService.start(pollingTask, options);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error during polling task:", error.message);
      throw error; // Optionally rethrow the error
    } else {
      console.error("Unknown error during polling task:", error);
      throw new Error("Unknown error occurred"); // Handle unknown errors
    }
  }
};

const stopBackgroundTask = async () => {
  await BackgroundService.stop();
  console.log("Background task stopped");
};

// The polling function to check invoice payment status
const pollInvoiceStatus = async (invoiceID: string) => {
  let attempts = 0;
  const maxAttempts = 5; // max attempts to check payment status
  const interval = 3000; // 3 seconds between each check

  try {
    while (attempts < maxAttempts) {
      // Call backend endpoint to check the payment status
      const response = await axios.get(
        `/transactions/status?invoiceID=${invoiceID}`
      );
      const { success } = response.data;

      if (success) {
        return true; // Payment confirmed
      }

      attempts++;
      await sleep(interval); // Wait for the next attempt
    }
    return false; // Payment not confirmed after max attempts
  } catch (error) {
    console.error("Error polling payment status:", error);
    return false;
  }
};

// Function to update the transaction status in the backend
const updateTransaction = async (transactionId: string, updateData: any) => {
  try {
    const response = await axios.put(
      `/transactions/${transactionId}`,
      updateData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating transaction:", error);
    return { error: true };
  }
};

// The background polling service
export const startBackgroundPolling = async (invoiceId: string) => {
  const PAYMENT_POLLING_INTERVAL = 5000; // 5 seconds
  const MAX_POLLING_ATTEMPTS = 10;

  try {
    // Check if BackgroundService is available
    if (!BackgroundService) {
      throw new Error("BackgroundService is not available.");
    }

    // Define the background task
    const task = async (): Promise<void> => {
      let attempts = 0;

      while (attempts < MAX_POLLING_ATTEMPTS) {
        // Poll for payment status
        const isPaid = await pollInvoiceStatus(invoiceId);

        if (isPaid) {
          // Show a success alert (but be careful as this may fail in background tasks)
          Alert.alert("ISPAID", "Payment confirmed!");

          // Update transaction status in the backend
          const result = await updateTransaction(invoiceId, { status: "Paid" });

          if (result.error) {
            throw new Error("Failed to update transaction after payment.");
          }

          Alert.alert("Payment Success", "Payment processed successfully!");
          BackgroundService.stop(); // Stop background service when payment is confirmed
          return; // Return nothing, just exit the task
        }

        // Wait for the next polling attempt
        attempts++;
        await sleep(PAYMENT_POLLING_INTERVAL);
      }

      throw new Error("Payment confirmation timed out.");
    };

    // Start background task
    await BackgroundService.start(task, {
      taskName: "PaymentPolling",
      taskTitle: "Payment Status Polling",
      taskDesc: "Polling for payment confirmation...",
      taskIcon: { name: "ic_launcher", type: "mipmap" },
      color: "#ff0000",
      parameters: { invoiceId }, // You can pass parameters if needed
    });
  } catch (error) {
    console.error("Error starting background task:", error);
    Alert.alert("Error", error as string);
  }
};
