import MoreButton from "@/components/MoreButton";
import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";
import { StyleSheet } from "react-native";

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Today",
          headerLargeTitle: true,
          headerRight: () => <MoreButton />,
        }}
      />
    </Stack>
  );
};

export default Layout;
const styles = StyleSheet.create({});
