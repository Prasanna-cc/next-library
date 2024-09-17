import { IRepository } from "../core/repository";
import { IMember, IMemberBase, IMemberDetails } from "../models/member.model";
import { MemberBaseSchema } from "../models/member.schema";
import { IPagedResponse, IPageRequest } from "../core/pagination";
import { DrizzleAdapter, Members } from "../database/drizzle/drizzleAdapter";
import { MySql2Database } from "drizzle-orm/mysql2/driver";
import { count, eq, like, or, SQL } from "drizzle-orm";
// import { AppError } from "../networking/libs/appError.utils";

export class MemberRepository
  implements IRepository<IMemberBase, IMemberDetails>
{
  private db: MySql2Database<Record<string, unknown>>;
  constructor(private readonly dbManager: DrizzleAdapter) {
    this.db = this.dbManager.getDrizzlePoolDb();
  }

  async create(data: IMemberBase): Promise<IMemberDetails | undefined> {
    const validatedData = MemberBaseSchema.parse(data);

    // Execution of queries:
    try {
      const [result] = await this.db
        .insert(Members)
        .values(validatedData as IMember)
        .$returningId();
      if (result.id) {
        const createdMember = await this.getById(result.id);
        return createdMember;
      } else throw new Error("There was a problem while creating the member");
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
    }
  }

  async update(
    MemberId: number,
    data: Partial<IMemberBase>
  ): Promise<IMemberDetails | undefined> {
    // Execution of queries:
    try {
      let oldMember = await this.getById(MemberId);
      if (oldMember) {
        const updatedMember = {
          ...oldMember,
          ...data,
        };
        const validatedMember = MemberBaseSchema.parse(updatedMember);
        const [result] = await this.db
          .update(Members)
          .set(validatedMember)
          .where(eq(Members.id, MemberId));
        if (result.affectedRows > 0) {
          //TODO: remove password.
          return updatedMember;
        } else throw new Error("There was a problem while updating the member");
      }
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
    }
  }

  async delete(memberId: number): Promise<IMemberDetails | undefined> {
    // Execution of queries:
    try {
      const deletedMember = await this.getById(memberId);
      if (deletedMember) {
        const [result] = await this.db
          .delete(Members)
          .where(eq(Members.id, memberId));
        if (result.affectedRows > 0) {
          return deletedMember;
        } else throw new Error("There was a problem while deleting the member");
      }
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
    }
  }

  async getById(memberId: number): Promise<IMemberDetails | undefined> {
    // Execution of queries:
    try {
      const [selectedMember] = await this.db
        .select({
          id: Members.id,
          name: Members.name,
          age: Members.age,
          email: Members.email,
          phoneNumber: Members.phoneNumber,
          address: Members.address,
          role: Members.role,
        })
        .from(Members)
        .where(eq(Members.id, memberId));
      if (!selectedMember) throw new Error("Member not found");
      return selectedMember;
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
    }
  }
  async list(
    params: IPageRequest
  ): Promise<IPagedResponse<IMember> | undefined> {
    let searchWhereClause: SQL | undefined;
    if (params.search) {
      const search = `%${params.search.toLowerCase()}%`;
      searchWhereClause = or(
        like(Members.id, search),
        like(Members.name, search),
        like(Members.phoneNumber, search),
        like(Members.address, search),
        like(Members.email, search)
      );
    }
    // const memberDetails = {
    //   id: Members.id,
    //   name: Members.name,
    //   age: Members.age,
    //   email: Members.email,
    //   phoneNumber: Members.phoneNumber,
    //   address: Members.address,
    //   role: Members.role,
    // };
    // Execution of queries:
    try {
      let matchedMembers: IMember[];
      if (searchWhereClause)
        matchedMembers = await this.db
          .select()
          .from(Members)
          .where(searchWhereClause)
          .offset(params.offset)
          .limit(params.limit);
      else
        matchedMembers = await this.db
          .select()
          .from(Members)
          .offset(params.offset)
          .limit(params.limit);
      const [totalMatchedMembers] = await this.db
        .select({ count: count() })
        .from(Members)
        .where(searchWhereClause);
      return {
        items: matchedMembers,
        pagination: {
          offset: params.offset,
          limit: params.limit,
          total: totalMatchedMembers.count,
        },
      };
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
    }
  }

  async getAllData(emailOrId: string | number) {
    try {
      let selectedMember;
      if (typeof emailOrId === "string")
        [selectedMember] = await this.db
          .select()
          .from(Members)
          .where(eq(Members.email, emailOrId));
      else
        [selectedMember] = await this.db
          .select()
          .from(Members)
          .where(eq(Members.id, emailOrId));

      if (!selectedMember) return null;
      return selectedMember;
    } catch (err) {
      if (err instanceof Error) throw err;
      // else if (err instanceof Error)
      //   throw new AppError(500, "Internal server error");
    }
  }
}
