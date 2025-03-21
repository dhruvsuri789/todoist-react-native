import { Colors, DATE_COLORS } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addDays, addWeeks, format, nextSaturday } from "date-fns";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useMMKVString } from "react-native-mmkv";

const DateSelectPage = () => {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useMMKVString("selectedDate");

  useEffect(() => {
    if (selectedDate) {
      setCurrentDate(new Date(selectedDate));
    }
  }, [selectedDate]);

  const onSave = (date: Date) => {
    setSelectedDate(date.toISOString());
    router.dismiss();
  };

  return (
    <View style={styles.constainer}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={() => onSave(currentDate)}>
              <Text style={styles.doneButton}>Done</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.quickButtons}>
        <TouchableOpacity
          style={styles.quickButton}
          onPress={() => onSave(new Date())}
        >
          <Ionicons name="today-outline" size={20} color={DATE_COLORS.today} />
          <Text style={styles.quickButtonText}>Today</Text>
          <Text style={styles.quickButtonDate}>
            {format(new Date(), "EEE")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickButton}
          onPress={() => onSave(addDays(new Date(), 1))}
        >
          <Ionicons
            name="calendar-outline"
            size={20}
            color={DATE_COLORS.tomorrow}
          />
          <Text style={styles.quickButtonText}>Tomorrow</Text>
          <Text style={styles.quickButtonDate}>
            {format(addDays(new Date(), 1), "EEE")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickButton}
          onPress={() => onSave(nextSaturday(new Date()))}
        >
          <Ionicons
            name="calendar-outline"
            size={20}
            color={DATE_COLORS.weekend}
          />
          <Text style={styles.quickButtonText}>This Weekend</Text>
          <Text style={styles.quickButtonDate}>
            {format(nextSaturday(new Date()), "EEE")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickButton}
          onPress={() => onSave(addWeeks(new Date(), 1))}
        >
          <Ionicons
            name="calendar-outline"
            size={20}
            color={DATE_COLORS.other}
          />
          <Text style={styles.quickButtonText}>Next Week</Text>
          <Text style={styles.quickButtonDate}>
            {format(addWeeks(new Date(), 1), "EEE")}
          </Text>
        </TouchableOpacity>
      </View>
      <DateTimePicker
        value={new Date(currentDate)}
        mode="date"
        display="inline"
        onChange={(event, date) => {
          const currentDate = date || new Date();
          onSave(currentDate);
        }}
        accentColor={Colors.primary}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      />
    </View>
  );
};

export default DateSelectPage;
const styles = StyleSheet.create({
  constainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  doneButton: {
    color: Colors.primary,
    fontWeight: "bold",
    fontSize: 18,
  },
  quickButtons: {
    width: "100%",
    gap: 30,
    paddingVertical: 20,
  },
  quickButton: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    paddingHorizontal: 16,
  },
  quickButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  quickButtonDate: {
    fontSize: 16,
    color: Colors.dark,
  },
});
