import type { Config } from "drizzle-kit";

export default {
  schema: "./db/schema.ts",
  out: "./db/migrations/drizzle",
  dialect: "sqlite",
  driver: "expo", // <--- very important
} satisfies Config;
