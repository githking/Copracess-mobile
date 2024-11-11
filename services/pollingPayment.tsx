import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import { Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

const BACKGROUND_FETCH_TASK = "payment-status-fetch";
let attempts = 0;
const maxAttempts = 5;
const interval = 3000;

const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async ({ data, error }) => {
  console.log("Background fetch triggered");
  if (error) {
    console.error("Background fetch error:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }

  const invoiceID = await SecureStore.getItemAsync("invoiceID");

  if (!invoiceID) {
    console.error("Invoice ID is missing");
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }

  try {
    while (attempts < maxAttempts) {
      const response = await axios.get(
        `/transactions/status?invoiceID=${invoiceID}`
      );

      console.log("Polling attempt:", attempts);

      const { success } = response.data;

      if (success) {
        await SecureStore.setItemAsync("paymentStatus", "success");
        Alert.alert("Payment Success", "Your payment was confirmed!");
        return BackgroundFetch.BackgroundFetchResult.NewData;
      }

      attempts++;
      await sleep(interval);
    }

    await SecureStore.setItemAsync("paymentStatus", "failed");
    await SecureStore.deleteItemAsync("invoiceID");
    return BackgroundFetch.BackgroundFetchResult.Failed;
  } catch (error) {
    console.error("Error checking payment status:", error);
    await SecureStore.setItemAsync("paymentStatus", "failed");
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export const startBackgroundFetch = async () => {
  try {
    console.log("Background fetch task registration in progress...");
    TaskManager.unregisterAllTasksAsync();

    await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK);

    await BackgroundFetch.setMinimumIntervalAsync(0.5);

    const response = await BackgroundFetch.getStatusAsync();

    console.log("Background fetch task registered", response);
  } catch (error) {
    console.error("Error starting background fetch:", error);
  }
};

export const checkPaymentStatus = async () => {
  try {
    const paymentStatus = await SecureStore.getItemAsync("paymentStatus");

    if (paymentStatus === "success") {
      Alert.alert("Payment Success", "Your payment was confirmed!");
      // Handle success case
    } else if (paymentStatus === "failed") {
      Alert.alert("Payment Error", "Payment confirmation failed.");
      // Handle failure case
    } else {
      console.log("Payment status not available yet.");
      // The status is still pending or not set yet
    }
  } catch (error) {
    console.error("Error checking payment status:", error);
  }
};
