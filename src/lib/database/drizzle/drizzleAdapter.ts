import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { Books, Members, MemberSessions, Transactions } from "./drizzleSchema";
import { migrate } from "drizzle-orm/mysql2/migrator";
import { AppEnvs } from "../../core/read-env";

export class DrizzleAdapter {
  private databaseUrl: string;
  private pool: mysql.Pool | null = null;
  private connection: mysql.Connection | null = null;

  constructor(connectionUrl: string) {
    this.databaseUrl = connectionUrl;
  }

  // async migrateDb() {
  //   let migrationClient: mysql.Connection | null = await mysql.createConnection(
  //     {
  //       uri: this.databaseUrl,
  //       multipleStatements: true,
  //     }
  //   );
  //   await migrate(drizzle(migrationClient), {
  //     migrationsFolder: "./migrations",
  //   });
  //   await migrationClient.end();
  //   migrationClient = null;
  // }

  getDrizzlePoolDb() {
    if (!this.pool)
      this.pool = mysql.createPool({
        uri: this.databaseUrl,
        multipleStatements: true,
      });
    return drizzle<Record<string, unknown>>(this.pool);
  }

  async shutDownPoolDb() {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
  }

  // async getDrizzleStandaloneDb() {
  //   if (!this.connection)
  //     this.connection = await mysql.createConnection(this.databaseUrl);
  //   return drizzle<Record<string, unknown>>(this.connection);
  // }

  // async shutDownStandaloneDb() {
  //   if (this.connection) {
  //     await this.connection.end();
  //     this.connection = null;
  //   }
  // }
}

const dbManager = new DrizzleAdapter(AppEnvs.DATABASE_URL);
export { dbManager, Books, Members, MemberSessions, Transactions };
