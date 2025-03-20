import { PROJECT_COLORS } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useMMKVString } from "react-native-mmkv";

const ColorSelectPage = () => {
  /* const [selected, setSelected] = useState<string>(() => {
    const color = storage.getString("selectedColor");
    if (!color) {
      storage.set("selectedColor", DEFAULT_PROJECT_COLOR);
    }
    return color || DEFAULT_PROJECT_COLOR;
  }); */

  const [selectedColor, setSelectedColor] = useMMKVString("selectedColor");

  // const router = useRouter();
  const headerHeight = useHeaderHeight();

  const onColorSelect = (color: string) => {
    setSelectedColor(color);
    // storage.set("selectedColor", color);
    // router.setParams({ bg: color });
  };

  return (
    <View style={{ marginTop: headerHeight }}>
      <View style={styles.colorRow}>
        {PROJECT_COLORS.map((color) => (
          <TouchableOpacity
            key={color}
            style={[styles.colorItem, { backgroundColor: color }]}
            onPress={() => onColorSelect(color)}
          >
            {selectedColor === color && (
              <Ionicons name="checkmark" size={24} color={"#fff"} style={{}} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
export default ColorSelectPage;

const styles = StyleSheet.create({
  colorRow: {
    flexDirection: "row",
    flexGrow: 1,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  colorItem: {
    height: 60,
    width: 60,
    margin: 5,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});
