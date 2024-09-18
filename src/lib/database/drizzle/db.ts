import "./envConfig";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import * as schema from "./drizzleSchema";

export const db = drizzle(sql, { schema });
