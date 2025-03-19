import { Colors } from "@/constants/Colors";
import { tokenCache } from "@/utils/cache";
import { ClerkLoaded, ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { Stack, usePathname, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Toaster } from "sonner-native";

// LogBox.ignoreLogs(["Clerk: Clerk has been loaded with development keys."]);

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
  );
}

const InitialLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (isSignedIn && !inAuthGroup) {
      router.replace("/(auth)/(tabs)/today");
    } else if (!isSignedIn && pathname !== "/") {
      router.replace("/");
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded)
    return (
      <View style={styles.activityContainer}>
        <ActivityIndicator size={"large"} color={Colors.primary} />
      </View>
    );

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Toaster />
          <InitialLayout />
        </GestureHandlerRootView>
      </ClerkLoaded>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  activityContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
