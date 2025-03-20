import Fab from "@/components/Fab";
import { Colors } from "@/constants/Colors";
import { projects } from "@/db/schema";
import { useAuth } from "@clerk/clerk-expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { eq } from "drizzle-orm";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import * as ContextMenu from "zeego/context-menu";

const Index = () => {
  const { signOut } = useAuth();
  const router = useRouter();
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);
  const isPro = false;

  const { data } = useLiveQuery(drizzleDb.select().from(projects), []);

  const onDeleteProject = async (id: number) => {
    await drizzleDb.delete(projects).where(eq(projects.id, id));
  };

  const onNewProject = async () => {
    if (!isPro && data.length >= 5) {
      // go pro
      // router.push("/browse/upgrade");
    } else {
      router.push("/browse/new-project");
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>My Projects</Text>
          <TouchableOpacity onPress={onNewProject}>
            <Ionicons name="add" size={24} color={Colors.dark} />
          </TouchableOpacity>
        </View>
        <Animated.FlatList
          data={data}
          itemLayoutAnimation={LinearTransition}
          renderItem={({ item }) => (
            <ContextMenu.Root key={item.id}>
              <ContextMenu.Trigger>
                <TouchableOpacity style={styles.projectButton}>
                  <Text style={{ color: item.color }}>#</Text>
                  <Text style={styles.projectButtonText}>{item.name}</Text>
                </TouchableOpacity>
              </ContextMenu.Trigger>
              <ContextMenu.Content>
                <ContextMenu.Item
                  key="Delete"
                  onSelect={() => onDeleteProject(item.id)}
                >
                  <ContextMenu.ItemTitle>Delete</ContextMenu.ItemTitle>
                  <ContextMenu.ItemIcon
                    ios={{ name: "trash", pointSize: 18 }}
                  />
                </ContextMenu.Item>
              </ContextMenu.Content>
            </ContextMenu.Root>
          )}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListFooterComponent={
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => signOut()}
            >
              <Text style={styles.clearButtonText}>Log Out</Text>
            </TouchableOpacity>
          }
        />
      </View>

      <Fab />
    </>
  );
};

export default Index;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    margin: 10,
  },
  clearButton: {
    marginTop: 10,
    padding: 14,
    borderRadius: 5,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  clearButtonText: {
    color: Colors.primary,
    fontWeight: "bold",
    fontSize: 18,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.lightBorder,
  },
  projectButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 5,
    gap: 14,
  },
  projectButtonText: {
    fontSize: 16,
  },
});
