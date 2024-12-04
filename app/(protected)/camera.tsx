import { SafeAreaView, AppState, Alert } from "react-native";
import React, { useEffect, useRef } from "react";
import { Stack, useRouter } from "expo-router";
import { CameraView } from "expo-camera";
import Overlay from "@/components/Overlay";
import axios from "axios";
import { decrypt } from "@/lib/encryption";

export default function CameraScreen() {
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const router = useRouter();

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // In camera.tsx
  const handleQRCodeScanned = async (data: string) => {
    if (data && !qrLock.current) {
      qrLock.current = true;
      try {
        // Log the original QR data
        console.log("Original QR data:", data);

        const match = data.match(/\/verify-booking\/(.+)/);
        if (!match) {
          console.log("Invalid QR code format");
          Alert.alert("Error", "Invalid QR code format");
          return;
        }

        const encodedData = match[1];
        console.log("Encoded data:", encodedData);

        const decodedData = decodeURIComponent(encodedData);
        console.log("Decoded data:", decodedData);

        // Add validation before decryption
        if (!decodedData) {
          throw new Error("No data to decrypt");
        }

        const decryptedData = decrypt(decodedData);
        console.log("Decrypted data:", decryptedData);

        // Validate decrypted data
        if (!decryptedData) {
          throw new Error("Decryption failed");
        }

        let parsedData;
        try {
          parsedData = JSON.parse(decryptedData);
        } catch (e) {
          throw new Error("Invalid decrypted data format");
        }

        const { bookingId, oilMillId, token } = parsedData;

        if (!bookingId || !oilMillId || !token) {
          throw new Error("Missing required fields in decrypted data");
        }

        const response = await axios.post("/verify-booking", {
          bookingId,
          oilMillId,
          token,
        });

        if (response.status === 200) {
          Alert.alert("Success", "Booking verified successfully");
          router.replace("/queue");
        } else {
          Alert.alert(
            "Error",
            response.data.error || "Failed to verify booking"
          );
        }
      } catch (error) {
        console.error("Error verifying booking:", error);
        Alert.alert(
          "Error",
          error instanceof Error ? error.message : "Failed to process QR code"
        );
      } finally {
        setTimeout(() => {
          qrLock.current = false;
        }, 500);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: "QR Code",
          headerShown: false,
        }}
      />

      <CameraView
        style={{ flex: 1 }}
        facing="back"
        onBarcodeScanned={({ data }) => handleQRCodeScanned(data)}
      />

      <Overlay />
    </SafeAreaView>
  );
}
