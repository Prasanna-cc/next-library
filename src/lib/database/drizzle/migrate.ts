import { migrate } from "drizzle-orm/mysql2/migrator";
import mysql from "mysql2/promise";
import { AppEnvs } from "../../core/read-env";
import { drizzle } from "drizzle-orm/mysql2";

async function migrateDb() {
  //   Connection for migrations
  let migrationClient: mysql.Connection | null = await mysql.createConnection({
    uri: AppEnvs.DATABASE_URL,
    multipleStatements: true, // Required for running migrations
  });
  //   Perform migrations
  await migrate(drizzle(migrationClient), {
    migrationsFolder: "./migrations", // Adjust this path to your migrations folder
  });
  await migrationClient.end();
  migrationClient = null;
}

migrateDb();
