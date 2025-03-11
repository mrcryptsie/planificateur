import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL || "postgresql://optimum_owner:npg_eRXCgxH0qcQ1@ep-falling-bar-a8rftqei-pooler.eastus2.azure.neon.tech/optimum?sslmode=require";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
