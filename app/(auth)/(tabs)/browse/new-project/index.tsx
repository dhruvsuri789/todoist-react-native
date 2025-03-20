import { Colors, DEFAULT_PROJECT_COLOR } from "@/constants/Colors";
import { projects } from "@/db/schema";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useHeaderHeight } from "@react-navigation/elements";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { Link, Stack, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useMMKVString } from "react-native-mmkv";

const IndexPage = () => {
  const [projectName, setProjectName] = useState("");
  const router = useRouter();
  // We will set and get the bg from color-select page
  // This actually does not work
  /* const { bg } = useLocalSearchParams<{ bg: string }>();
  const [selectedColor, setSelectedColor] = useState<string>(
    DEFAULT_PROJECT_COLOR
  ); */

  const [selectedColor, setSelectedColor] = useMMKVString("selectedColor");

  // Calculate the header height the right way instead of manual marginTop
  // This also works for the tab bar
  const headerHeight = useHeaderHeight();

  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);

  /* useEffect(() => {
    if (bg) {
      setSelectedColor(bg);
    }
  }, [bg]); */

  const onCreateProject = async () => {
    await drizzleDb.insert(projects).values({
      name: projectName,
      color: selectedColor || DEFAULT_PROJECT_COLOR,
    });
    setSelectedColor(DEFAULT_PROJECT_COLOR);
    router.dismiss();
  };

  return (
    <View style={{ marginTop: headerHeight }}>
      {/*
       * We are creating the screen here for headerRight and not inside the layout because we want to access the onCreateProject function
       * We could add this functionality to the layout and use state management library like zustand but that would mean we would have to pass the function as a prop since this function would be in the layout file
       */}
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity
              onPress={onCreateProject}
              disabled={projectName.length === 0}
            >
              <Text
                style={
                  projectName.length === 0
                    ? styles.btnTextDisabled
                    : styles.btnText
                }
              >
                Create
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        <TextInput
          placeholder="Name"
          value={projectName}
          onChangeText={setProjectName}
          style={styles.input}
          autoFocus
        />
        <Link href={"/(auth)/(tabs)/browse/new-project/color-select"} asChild>
          <TouchableOpacity style={styles.btnItem}>
            <Ionicons
              name="color-palette-outline"
              size={24}
              color={Colors.dark}
            />
            <Text style={styles.btnColorText}>Color</Text>
            <View
              style={[
                styles.colorPreview,
                { backgroundColor: selectedColor || DEFAULT_PROJECT_COLOR },
              ]}
            />
            <Ionicons name="chevron-forward" size={22} color={Colors.dark} />
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

export default IndexPage;
const styles = StyleSheet.create({
  btnText: {
    fontSize: 18,
    fontWeight: "500",
    color: Colors.primary,
  },
  btnTextDisabled: {
    fontSize: 18,
    fontWeight: "500",
    color: Colors.dark,
  },
  container: {
    marginHorizontal: 20,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  input: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.lightBorder,
    padding: 12,
    fontSize: 16,
  },
  btnItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    gap: 16,
  },
  btnColorText: {
    fontSize: 16,
    flex: 1,
    fontWeight: "500",
  },
  colorPreview: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
});
