import { Colors } from "@/constants/Colors";
import { projects, todos } from "@/db/schema";
import { Project, Todo } from "@/types/interfaces";
import { Ionicons } from "@expo/vector-icons";
import { eq } from "drizzle-orm";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type TodoFormProps = {
  todo?: Todo & {
    project_name: string;
    project_color: string;
    project_id: number;
  };
};

type TodoFormData = {
  name: string;
  description: string;
};

const TodoForm = ({ todo }: TodoFormProps) => {
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<TodoFormData>({
    defaultValues: {
      name: todo?.name || "",
      description: todo?.description || "",
    },
    mode: "onChange",
  });

  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);
  const { data } = useLiveQuery(drizzleDb.select().from(projects), []);

  const [selectedProject, setSelectedProject] = useState<Project>(
    todo?.project_id
      ? {
          id: todo.project_id,
          name: todo.project_name,
          color: todo.project_color,
        }
      : { id: 1, name: "Inbox", color: "#000" }
  );

  const onSubmit: SubmitHandler<TodoFormData> = async (data) => {
    if (todo) {
      //Update
      await drizzleDb
        .update(todos)
        .set({
          name: data.name,
          description: data.description,
          project_id: selectedProject.id,
          due_date: 0, // TODO: Add due date
        })
        .where(eq(todos.id, todo.id))
        .then(() => {
          console.log("Updated todo");
        });
    } else {
      //Create
      await drizzleDb
        .insert(todos)
        .values({
          name: data.name,
          description: data.description,
          priority: 0,
          due_date: 0, // TODO: Add due date
          date_added: Date.now(),
          completed: 0,
          date_completed: null,
          project_id: selectedProject.id,
        })
        .then(() => {
          console.log("Inserted todo");
        });
    }
  };

  useEffect(() => {
    trigger();
  }, [trigger]);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="always"
      >
        <Controller
          control={control}
          name="name"
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Task name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoFocus
              autoCorrect={false}
              style={styles.titleInput}
            />
          )}
        />
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Description"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              multiline
              style={styles.descriptionInput}
            />
          )}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.actionButtonContainer}
          keyboardShouldPersistTaps="always"
        >
          <Pressable
            style={({ pressed }) => {
              return [
                styles.outlinedButton,
                {
                  backgroundColor: pressed ? Colors.lightBorder : "transparent",
                },
              ];
            }}
          >
            <Ionicons name="calendar-outline" size={20} color={Colors.dark} />
            <Text style={styles.outlinedButtonText}>Date</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => {
              return [
                styles.outlinedButton,
                {
                  backgroundColor: pressed ? Colors.lightBorder : "transparent",
                },
              ];
            }}
          >
            <Ionicons name="flag-outline" size={20} color={Colors.dark} />
            <Text style={styles.outlinedButtonText}>Priority</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => {
              return [
                styles.outlinedButton,
                {
                  backgroundColor: pressed ? Colors.lightBorder : "transparent",
                },
              ];
            }}
          >
            <Ionicons name="location-outline" size={20} color={Colors.dark} />
            <Text style={styles.outlinedButtonText}>Location</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => {
              return [
                styles.outlinedButton,
                {
                  backgroundColor: pressed ? Colors.lightBorder : "transparent",
                },
              ];
            }}
          >
            <Ionicons name="pricetags-outline" size={20} color={Colors.dark} />
            <Text style={styles.outlinedButtonText}>Labels</Text>
          </Pressable>
        </ScrollView>
        <View style={styles.bottomRow}>
          <Pressable
            onPress={() => {}}
            style={({ pressed }) => {
              return [
                styles.outlinedButton,
                {
                  backgroundColor: pressed ? Colors.lightBorder : "transparent",
                },
              ];
            }}
          >
            <Ionicons name="pricetags-outline" size={20} color={Colors.dark} />
            <Text style={styles.outlinedButtonText}>Labels</Text>
          </Pressable>
          <Pressable
            onPress={handleSubmit(onSubmit)}
            style={[styles.submitButton, { opacity: errors.name ? 0.5 : 1 }]}
            disabled={errors.name ? true : false}
          >
            <Ionicons name="arrow-up" size={24} color={"#fff"} />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default TodoForm;
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    gap: 12,
    paddingTop: 16,
  },
  titleInput: {
    fontSize: 20,
    paddingHorizontal: 16,
  },
  descriptionInput: {
    fontSize: 18,
    paddingHorizontal: 16,
  },
  actionButtonContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  outlinedButton: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.lightBorder,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
  },
  outlinedButtonText: {
    fontSize: 14,
    color: Colors.dark,
    fontWeight: "500",
  },
  bottomRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.lightBorder,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    padding: 6,
  },
});
