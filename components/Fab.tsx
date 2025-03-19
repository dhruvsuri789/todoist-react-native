import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";

const Fab = () => {
  const router = useRouter();
  const onPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/task/new");
  };
  return (
    <TouchableOpacity style={styles.fab} onPress={onPress}>
      <Ionicons name="add" size={28} color="white" />
    </TouchableOpacity>
  );
};

export default Fab;
const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    zIndex: 1000,
    height: 56,
    width: 56,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 50,
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  },
});
