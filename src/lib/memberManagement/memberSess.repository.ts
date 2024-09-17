import { MySql2Database } from "drizzle-orm/mysql2";
import { IRepository } from "../core/repository";
import {
  DrizzleAdapter,
  MemberSessions,
} from "../database/drizzle/drizzleAdapter";
import { IMemberSessBase } from "../models/memberSess.model";
import { eq } from "drizzle-orm";
import { ResultSetHeader } from "mysql2/promise";

export class MemberSessRepository
  implements
    Omit<
      IRepository<IMemberSessBase, IMemberSessBase>,
      "delete" | "update" | "list"
    >
{
  private db: MySql2Database<Record<string, unknown>>;
  constructor(private readonly dbManager: DrizzleAdapter) {
    this.db = this.dbManager.getDrizzlePoolDb();
  }

  async create(data: IMemberSessBase): Promise<IMemberSessBase | undefined> {
    try {
      const [result] = await this.db.insert(MemberSessions).values(data);

      if (result.affectedRows > 0) {
        return data;
      } else throw new Error("There was a problem while login in.");
    } catch (err) {
      if (err instanceof Error) throw err;
    }
  }

  async update(id: number, refreshToken: string) {
    try {
      const [result] = await this.db
        .update(MemberSessions)
        .set({ refreshToken })
        .where(eq(MemberSessions.refreshToken, refreshToken));
      if (result.affectedRows > 0) {
        const updatedMemberSess: IMemberSessBase = { id, refreshToken };
        return updatedMemberSess;
      } else throw new Error("There was a problem while updating the session");
    } catch (err) {
      if (err instanceof Error) throw err;
    }
  }

  async delete(
    refreshToken: string,
    id?: number
  ): Promise<IMemberSessBase | IMemberSessBase[] | undefined> {
    try {
      let result: ResultSetHeader;
      let deletedEntries: IMemberSessBase | IMemberSessBase[];
      if (id) {
        deletedEntries = (await this.getById(id))!;
        [result] = await this.db
          .delete(MemberSessions)
          .where(eq(MemberSessions.id, id));
      } else {
        [deletedEntries] = await this.db
          .select()
          .from(MemberSessions)
          .where(eq(MemberSessions.refreshToken, refreshToken));
        [result] = await this.db
          .delete(MemberSessions)
          .where(eq(MemberSessions.refreshToken, refreshToken));
      }
      if (result.affectedRows > 0) {
        return deletedEntries;
      } else
        throw new Error("There was a problem while deleting the session/s");
    } catch (err) {
      if (err instanceof Error) throw err;
    }
  }

  async getById(id: number): Promise<IMemberSessBase[] | undefined> {
    try {
      const selectedMembers: IMemberSessBase[] = await this.db
        .select()
        .from(MemberSessions)
        .where(eq(MemberSessions.id, id));
      if (!selectedMembers) throw new Error("Member not found");
      return selectedMembers;
    } catch (err) {
      if (err instanceof Error) throw err;
    }
  }

  async getByToken(refreshToken: string): Promise<IMemberSessBase | undefined> {
    try {
      const [selectedMembers] = await this.db
        .select()
        .from(MemberSessions)
        .where(eq(MemberSessions.refreshToken, refreshToken));
      if (!selectedMembers) throw new Error("Token not found");
      return selectedMembers;
    } catch (err) {
      if (err instanceof Error) throw err;
    }
  }
}
