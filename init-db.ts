
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL || "postgresql://optimum_owner:npg_eRXCgxH0qcQ1@ep-falling-bar-a8rftqei-pooler.eastus2.azure.neon.tech/optimum?sslmode=require";

async function main() {
  console.log("Initializing database...");
  
  // Connexion à la base de données
  const client = postgres(databaseUrl);
  const db = drizzle(client);

  // Exécution des migrations
  console.log("Running migrations...");
  await migrate(db, { migrationsFolder: "./migrations" });
  console.log("Migrations completed successfully!");

  // Fermeture de la connexion
  await client.end();
  console.log("Database initialization completed!");
}

main().catch((err) => {
  console.error("Error initializing database:", err);
  process.exit(1);
});
