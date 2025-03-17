import { Colors } from "@/constants/Colors";
import { tokenCache } from "@/utils/cache";
import { ClerkLoaded, ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
  );
}

const InitialLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    console.log("isLoaded", isLoaded);
    console.log("isSignedIn", isSignedIn);

    if (!isSignedIn) router.replace("/");

    router.replace("/(auth)/(tabs)/today");
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
        <InitialLayout />
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
