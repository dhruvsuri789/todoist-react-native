import { Colors } from "@/constants/Colors";
import migrations from "@/db/migrations/drizzle/migrations";
import { addDummyData } from "@/utils/addDummyData";
import { tokenCache } from "@/utils/cache";
import { ClerkLoaded, ClerkProvider, useAuth } from "@clerk/clerk-expo";
import * as Sentry from "@sentry/react-native";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import Constants, { ExecutionEnvironment } from "expo-constants";
import {
  Stack,
  useNavigationContainerRef,
  usePathname,
  useRouter,
  useSegments,
} from "expo-router";
import { openDatabaseSync, SQLiteProvider } from "expo-sqlite";
import { Suspense, useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Toaster } from "sonner-native";

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay:
    Constants.executionEnvironment === ExecutionEnvironment.StoreClient, // Only in native builds, not in Expo Go.
});

Sentry.init({
  dsn: "https://cd9bfb6223f90146facd274e6300261e@o4509003936694272.ingest.us.sentry.io/4509003948294144",
  attachScreenshot: true,
  replaysSessionSampleRate: 0.1, // Change in production to 0.1
  replaysOnErrorSampleRate: 1.0,
  tracesSampleRate: 1.0, // Manipulate on production
  profilesSampleRate: 1.0,
  integrations: [
    Sentry.mobileReplayIntegration({
      maskAllImages: false,
      maskAllText: false,
      maskAllVectors: false,
    }),
    navigationIntegration,
    // Same as below i think
    Sentry.spotlightIntegration(),
  ],
  enableNativeFramesTracking:
    Constants.executionEnvironment === ExecutionEnvironment.StoreClient, // Only in native builds, not in Expo Go.
  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

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

export default Sentry.wrap(function RootLayout() {
  // Can enable change listener here or down in SQLiteProvider
  // const expoDB = openDatabaseSync("todoist", {enableChangeListener: true});
  const expoDB = openDatabaseSync("todoist");
  const db = drizzle(expoDB);
  const { success, error } = useMigrations(db, migrations);

  const ref = useNavigationContainerRef();

  useEffect(() => {
    if (ref) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);

  useEffect(() => {
    if (!success) return;

    addDummyData(db);
  }, [success]);

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <Suspense fallback={<Loading />}>
          <SQLiteProvider
            databaseName="todoist"
            useSuspense
            options={{ enableChangeListener: true }}
          >
            <GestureHandlerRootView style={{ flex: 1 }}>
              <Toaster />
              <InitialLayout />
            </GestureHandlerRootView>
          </SQLiteProvider>
        </Suspense>
      </ClerkLoaded>
    </ClerkProvider>
  );
});

function Loading() {
  return <ActivityIndicator size={"large"} color={Colors.primary} />;
}

const styles = StyleSheet.create({
  activityContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
