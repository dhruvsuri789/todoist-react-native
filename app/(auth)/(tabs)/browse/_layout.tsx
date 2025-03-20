import { Colors } from "@/constants/Colors";
import { useUser } from "@clerk/clerk-expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack } from "expo-router";
import { Image, StyleSheet } from "react-native";

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: Colors.backgroundAlt },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Browse",
          headerLeft: () => <HeaderLeft />,
          headerRight: () => <HeaderRight />,
        }}
      />
      <Stack.Screen
        name="new-project"
        options={{ presentation: "modal", headerShown: false }}
      />
    </Stack>
  );
};

const HeaderLeft = () => {
  const { user } = useUser();
  return <Image source={{ uri: user?.imageUrl }} style={styles.image} />;
};

const HeaderRight = () => {
  return (
    // <Link href={"/browse/settings"}>
    <Ionicons name="settings-outline" size={24} color={Colors.primary} />
    // </Link>
  );
};

export default Layout;
const styles = StyleSheet.create({
  image: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});
