import React, { useEffect, useState } from "react";
import { SplashScreen, Slot, useRouter, useSegments } from "expo-router";
import { useFonts } from "expo-font";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import SplashScreenComponent from "@/components/SplashScreen";

// Separate Authentication guard component
const AuthenticationGuard = ({ children }: { children: React.ReactNode }) => {
    const { authState } = useAuth();
    const segments = useSegments();
    const router = useRouter();
    const [isNavigationReady, setIsNavigationReady] = useState(false);

    useEffect(() => {
        if (!isNavigationReady) {
            setIsNavigationReady(true);
            return;
        }

        const inAuthGroup = segments[0] === "(auth)";
        const inProtectedGroup = segments[0] === "(protected)";

        // Handle navigation based on authentication state
        if (!authState?.authenticated && !inAuthGroup) {
            router.replace("/(auth)/signIn");
        } else if (authState?.authenticated && inAuthGroup) {
            if (authState?.data.role === "COPRA_BUYER") {
                router.replace("/(protected)/buyerhome");
            } else {
                router.replace("/(protected)/oilhome");
            }
        }
    }, [authState?.authenticated, segments, isNavigationReady]);

    return <>{children}</>;
};

// Root Layout Component
const RootLayout = () => {
    const [fontsLoaded, error] = useFonts({
        "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
        "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
        "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
        "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
        "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
        "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
        "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
        "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
    });

    const [isAppReady, setIsAppReady] = useState(false);

    useEffect(() => {
        if (error) throw error;

        if (fontsLoaded) {
            const prepare = async () => {
                try {
                    // Hide splash screen after fonts are loaded
                    await SplashScreen.hideAsync();
                    setIsAppReady(true);
                } catch (e) {
                    console.warn(e);
                }
            };

            prepare();
        }
    }, [fontsLoaded, error]);

    if (!isAppReady || !fontsLoaded) {
        return (
            <SplashScreenComponent
                onFinish={() => setIsAppReady(true)}
                isFontsLoaded={fontsLoaded}
                isAppReady={isAppReady}
            />
        );
    }

    return (
        <AuthProvider>
            <AuthenticationGuard>
                <Slot />
            </AuthenticationGuard>
        </AuthProvider>
    );
};

export default RootLayout;
