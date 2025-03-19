import { projects, todos } from "@/db/schema";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";

import AsyncStorage from "expo-sqlite/kv-store";

export const addDummyData = async (db: ExpoSQLiteDatabase) => {
  // If initialized, don't add dummy data because its already there
  // This will only run on the first load
  const value = AsyncStorage.getItemSync("initialized");
  if (value) return;

  await db.insert(projects).values([
    { name: "Inbox", color: "#000000" },
    { name: "Work", color: "#0a009c" },
  ]);
  await db.insert(todos).values([
    {
      name: "Check out Galaxies.dev for epic React Native courses",
      description: "And learn how to build your own apps",
      priority: 1,
      completed: 0,
      project_id: 1,
      date_added: Date.now(),
    },
    {
      name: "Buy groceries for the week",
      priority: 2,
      completed: 0,
      project_id: 1,
      date_added: Date.now(),
    },
  ]);

  //Set initialized to true for the fist time so the subsequent calls don't add dummy data
  AsyncStorage.setItemSync("initialized", "true");
};
