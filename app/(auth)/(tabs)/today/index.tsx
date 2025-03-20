import Fab from "@/components/Fab";
import TaskRow from "@/components/TaskRow";
import { Colors } from "@/constants/Colors";
import { projects, todos } from "@/db/schema";
import { Todo } from "@/types/interfaces";
import { format } from "date-fns";
import { eq } from "drizzle-orm";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import {
  RefreshControl,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Section {
  title: string;
  data: Todo[];
}

const Index = () => {
  // Get the database
  const db = useSQLiteContext();
  useDrizzleStudio(db);
  const drizzleDb = drizzle(db); // We need to use the drizzle instance

  const { data } = useLiveQuery(
    drizzleDb
      .select()
      .from(todos)
      .leftJoin(projects, eq(todos.project_id, projects.id))
      .where(eq(todos.completed, 0))
  );

  const [sectionListData, setSectionListData] = useState<Section[]>([]);
  const { top } = useSafeAreaInsets();

  useEffect(() => {
    const formatedData = data?.map((item) => ({
      ...item.todos,
      project_name: item.projects?.name,
      project_color: item.projects?.color,
    }));

    // Group tasks by day
    const groupedByDay = formatedData?.reduce(
      (acc: { [key: string]: Todo[] }, task) => {
        const day = format(
          new Date(task.due_date || new Date()),
          "d MMM · eee"
        );
        if (!acc[day]) {
          acc[day] = [];
        }
        acc[day].push(task);
        return acc;
      },
      {}
    );

    // Convert grouped data to sections array
    const listData: Section[] = Object.entries(groupedByDay || {}).map(
      ([day, tasks]) => ({
        title: day,
        data: tasks,
      })
    );

    // Sort sections by date
    listData.sort((a, b) => {
      const dateA = new Date(a.data[0].due_date || new Date());
      const dateB = new Date(b.data[0].due_date || new Date());
      return dateA.getTime() - dateB.getTime();
    });

    setSectionListData(listData);
  }, [data]);

  return (
    // This padding top is similar to sticky header
    <View style={[styles.container, { paddingTop: top + 20 }]}>
      <SectionList
        // To make the content adjust automatically for top and bottom insets
        contentInsetAdjustmentBehavior="automatic"
        sections={sectionListData}
        renderItem={(item) => <TaskRow task={item.item} />}
        renderSectionHeader={({ section }) => (
          <Text style={styles.header}>{section.title}</Text>
        )}
        // Pull to refresh
        // But since we are using useliveQuery, we don't need it as list will update automatically whenever the data changes
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => {}} />
        }
      />
      {/* <Button
        title="Try!"
        onPress={() => {
          Sentry.captureException(new Error("First error"));
        }}
      /> */}
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
  header: {
    fontSize: 16,
    backgroundColor: "#fff",
    fontWeight: "bold",
    padding: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.lightBorder,
  },
});
