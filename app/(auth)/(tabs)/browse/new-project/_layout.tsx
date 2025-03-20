import { Colors } from "@/constants/Colors";
import { Stack, useRouter } from "expo-router";
import { Button, StyleSheet } from "react-native";

const Layout = () => {
  const router = useRouter();
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerTintColor: Colors.primary,
        headerTitleStyle: { color: "#000" },
        contentStyle: { backgroundColor: Colors.backgroundAlt },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "New Project",
          headerTransparent: true,
          headerLeft: () => (
            //Dismiss because this is a modal
            <Button
              title="Cancel"
              color={Colors.primary}
              onPress={() => router.dismiss()}
            />
          ),
        }}
      />
      <Stack.Screen
        name="color-select"
        options={{ title: "Color", headerTransparent: true }}
      />
    </Stack>
  );
};

export default Layout;
const styles = StyleSheet.create({});
