import { Colors } from "@/constants/Colors";
import { todos } from "@/db/schema";
import { Todo } from "@/types/interfaces";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { Link } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";

interface TaskRowProps {
  task: Todo;
}

const TaskRow = ({ task }: TaskRowProps) => {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);

  const markAsCompleted = async () => {
    await drizzleDb
      .update(todos)
      .set({ completed: 1, date_completed: Date.now() })
      .where(eq(todos.id, task.id));
  };

  return (
    <View>
      <Link href={`/task/${task.id}`} style={styles.container} asChild>
        <TouchableOpacity>
          <View style={styles.row}>
            <BouncyCheckbox
              size={25}
              textContainerStyle={{ display: "none" }}
              fillColor={task.project_color}
              unFillColor="#fff"
              textStyle={{
                color: "#000",
                fontSize: 16,
                textDecorationLine: "none",
              }}
              isChecked={task.completed === 1}
              onPress={markAsCompleted}
            />
            <Text style={styles.name}>{task.name}</Text>
          </View>
          <Text style={styles.projectName}>{task.project_name}</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default TaskRow;
const styles = StyleSheet.create({
  container: {
    padding: 14,
    backgroundColor: "#fff",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.lightBorder,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  name: {
    fontSize: 16,
    flex: 1,
  },
  projectName: {
    fontSize: 12,
    color: Colors.dark,
    alignSelf: "flex-end",
    marginTop: 4,
  },
});
