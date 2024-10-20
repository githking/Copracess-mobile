import { ClerkProvider, ClerkLoaded, useAuth } from "@clerk/clerk-expo";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { tokenCache } from "./tokex";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
  );
}

interface RootAuthProps {
  children: React.ReactNode;
}

function InitialLayout({ children }: RootAuthProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) return;

    const inTabsGroup = segments[0] === "(auth)";
    console.log("isSignedIn", isSignedIn);

    if (isSignedIn && !inTabsGroup) {
      router.replace("/(copraowner)/home");
    } else if (!isSignedIn) {
      router.replace("/signIn");
    }
  }, [isSignedIn]);

  return <>{children}</>;
}

export default function RootAuth({ children }: RootAuthProps) {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <InitialLayout>{children}</InitialLayout>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
