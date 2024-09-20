import { defineConfig } from "drizzle-kit";
import { AppEnvs } from "./src/lib/core/read-env";

export default defineConfig({
  schema: "./src/lib/database/drizzle/drizzleSchemaMySql.ts",
  out: "./src/lib/database/drizzle/localMigration",
  dialect: "mysql",
  dbCredentials: {
    url: AppEnvs.DATABASE_URL,
  },
  verbose: true,
  strict: true,
});

// import "@/lib/database/drizzle/envConfig";

// export default defineConfig({
//   schema: "./src/lib/database/drizzle/drizzleSchema.ts",
//   dialect: "postgresql",
//   dbCredentials: {
//     url: AppEnvs.POSTGRES_URL!,
//   },
// });
