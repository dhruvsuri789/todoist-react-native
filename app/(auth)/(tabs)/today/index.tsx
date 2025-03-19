import Fab from "@/components/Fab";
import { todos } from "@/db/schema";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { useSQLiteContext } from "expo-sqlite";
import { StyleSheet, Text, View } from "react-native";

const Index = () => {
  // Get the database
  const db = useSQLiteContext();
  useDrizzleStudio(db);
  const drizzleDb = drizzle(db); // We need to use the drizzle instance

  const { data } = useLiveQuery(drizzleDb.select().from(todos));

  return (
    <View style={styles.container}>
      <Text>Index</Text>
      <Fab />
    </View>
  );
};

export default Index;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 82,
  },
});
