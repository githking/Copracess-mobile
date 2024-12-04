import { SafeAreaView, AppState } from "react-native";
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
            if (appState.current.match(/inactive|background/) && nextAppState === "active") {
                qrLock.current = false;
            }
            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, []);

    const handleQRCodeScanned = async (data: string) => {
        if (data && !qrLock.current) {
            qrLock.current = true;
            try {
                const match = data.match(/\/verify-booking\/(.+)/);
                if (!match) {
                    console.log("Invalid QR code data");
                    return;
                }

                const encodedData = match[1];

                const decodedData = decodeURIComponent(encodedData);
                console.log("Decoded Data:", decodedData);

                const decryptedData = decrypt(decodedData);
                console.log("Decrypted Data:", decryptedData);

                const { bookingId, oilMillId, token } = JSON.parse(decryptedData);

                const response = await axios.post("/verify-booking", {
                    bookingId,
                    oilMillId,
                    token,
                });

                if (response.status === 200) {
                    console.log("Booking verified successfully:", response.data.message);

                    router.replace("/queue");
                } else {
                    console.log("Failed to verify booking:", response.data.error);
                }
            } catch (error) {
                console.error("Error verifying booking:", error);
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
