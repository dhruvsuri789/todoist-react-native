import { Colors } from "@/constants/Colors";
import { Stack, useRouter } from "expo-router";
import { Button, StyleSheet, useWindowDimensions } from "react-native";

const Layout = () => {
  const { height } = useWindowDimensions();
  const router = useRouter();

  return (
    <Stack screenOptions={{ contentStyle: { backgroundColor: "#fff" } }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="task/new"
        options={{
          presentation: "formSheet",
          title: "",
          headerShown: false,
          // We want the sheet to be 22% of the screen
          // This is a fallback to make sure everyone can use your app correctly
          sheetAllowedDetents: height > 700 ? [0.22] : "fitToContents",
          sheetGrabberVisible: false,
          sheetExpandsWhenScrolledToEdge: false,
          sheetCornerRadius: 10,
        }}
      />
      <Stack.Screen
        name="task/[id]"
        options={{
          presentation: "formSheet",
          title: "",
          headerShown: false,
          sheetAllowedDetents: height > 700 ? [0.22] : "fitToContents",
          sheetGrabberVisible: false,
          sheetExpandsWhenScrolledToEdge: false,
          sheetCornerRadius: 10,
        }}
      />
      <Stack.Screen
        name="task/date-select"
        options={{
          presentation: "formSheet",
          title: "Schedule",
          sheetAllowedDetents: height > 700 ? [0.5, 0.9] : "fitToContents",
          sheetGrabberVisible: true,
          sheetExpandsWhenScrolledToEdge: false,
          sheetCornerRadius: 10,
          headerLeft: () => (
            <Button
              title="Cancel"
              onPress={() => router.back()}
              color={Colors.primary}
            />
          ),
        }}
      />
    </Stack>
  );
};

export default Layout;
const styles = StyleSheet.create({});
