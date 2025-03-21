import { Colors, DATE_COLORS } from "@/constants/Colors";
import { projects, todos } from "@/db/schema";
import { Project, Todo } from "@/types/interfaces";
import { Ionicons } from "@expo/vector-icons";
import { format, isSameDay, isTomorrow } from "date-fns";
import { eq } from "drizzle-orm";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useMMKVString } from "react-native-mmkv";

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
  const router = useRouter();
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

  const [showProjects, setShowProjects] = useState(false);

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
          due_date: selectedDate.getTime(),
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
          due_date: selectedDate.getTime(),
          date_added: Date.now(),
          completed: 0,
          date_completed: null,
          project_id: selectedProject.id,
        })
        .then(() => {
          console.log("Inserted todo");
        });
    }

    router.dismiss();
  };

  const changeDate = () => {
    const dateString = selectedDate.toISOString();
    setPreviouslySelectedDate(dateString);
    router.push("/task/date-select");
  };

  const getDateObject = (date: Date) => {
    if (isSameDay(date, new Date())) {
      return {
        name: "Today",
        color: DATE_COLORS.today,
      };
    } else if (isTomorrow(new Date(date))) {
      return {
        name: "Tomorrow",
        color: DATE_COLORS.tomorrow,
      };
    } else {
      return {
        name: format(new Date(date), "EEE, d MMM"),
        color: DATE_COLORS.other,
      };
    }
  };

  const onProjectPress = (project: Project) => {
    setSelectedProject(project);
    setShowProjects(false);
  };

  const [selectedDate, setSelectedDate] = useState<Date>(
    todo?.due_date ? new Date(todo.due_date) : new Date()
  );

  const [previouslySelectedDate, setPreviouslySelectedDate] =
    useMMKVString("selectedDate");

  useEffect(() => {
    if (previouslySelectedDate) {
      setSelectedDate(new Date(previouslySelectedDate));
      setPreviouslySelectedDate(undefined);
    }
  }, [previouslySelectedDate]);

  useEffect(() => {
    trigger();
  }, [trigger]);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Modal
        visible={showProjects}
        onRequestClose={() => setShowProjects(false)}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <FlatList
              data={data}
              showsVerticalScrollIndicator={false}
              style={{ borderRadius: 12 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.projectButton}
                  onPress={() => onProjectPress(item)}
                >
                  <Text style={{ color: item.color }}>#</Text>
                  <Text style={styles.projectButtonText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id.toString()}
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    height: StyleSheet.hairlineWidth,
                    backgroundColor: Colors.lightBorder,
                  }}
                />
              )}
            />
          </View>
        </View>
      </Modal>
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
            onPress={() => changeDate()}
            style={({ pressed }) => {
              return [
                styles.outlinedButton,
                {
                  backgroundColor: pressed ? Colors.lightBorder : "transparent",
                  borderColor: getDateObject(selectedDate).color,
                },
              ];
            }}
          >
            <Ionicons
              name="calendar-outline"
              size={20}
              color={getDateObject(selectedDate).color}
            />
            <Text
              style={[
                styles.outlinedButtonText,
                { color: getDateObject(selectedDate).color },
              ]}
            >
              {getDateObject(selectedDate).name}
            </Text>
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
            onPress={() => setShowProjects(true)}
            style={({ pressed }) => {
              return [
                styles.outlinedButton,
                {
                  backgroundColor: pressed ? Colors.lightBorder : "transparent",
                  borderColor: selectedProject.color,
                },
              ];
            }}
          >
            {selectedProject.id === 1 && (
              <Ionicons
                name="file-tray-outline"
                size={20}
                color={Colors.dark}
              />
            )}
            {selectedProject.id !== 1 && (
              <Text style={{ color: selectedProject.color }}>#</Text>
            )}
            <Text
              style={[
                styles.outlinedButtonText,
                { color: selectedProject.color },
              ]}
            >
              {selectedProject.name}
            </Text>
            <Ionicons
              name="caret-down"
              size={14}
              color={selectedProject.color}
            />
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    width: Dimensions.get("window").width - 60,
    height: 200,
    backgroundColor: "white",
    borderRadius: 12,
    boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.2)",
    elevation: 5,
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
