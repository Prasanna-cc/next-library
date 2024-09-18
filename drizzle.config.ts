// import { defineConfig } from "drizzle-kit";
// import { AppEnvs } from "./src/lib/core/read-env";

// export default defineConfig({
//   schema: "./src/app/database/drizzle/drizzleSchema.ts",
//   out: "./src/app/database/drizzle/migration",
//   dialect: "mysql",
//   dbCredentials: {
//     url: AppEnvs.DATABASE_URL,
//   },
//   verbose: true,
//   strict: true,
// });

import "@/lib/database/drizzle/envConfig";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/database/drizzle/drizzleSchema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});
