import { IRepository } from "../core/repository";
import { IMember, IMemberBase, IMemberDetails } from "../models/member.model";
import { MemberBaseSchema } from "../models/member.schema";
import { IPagedResponse, IPageRequest } from "../core/pagination";
import { count, eq, like, or, SQL } from "drizzle-orm";
import { VercelPgDatabase } from "drizzle-orm/vercel-postgres";
import { db } from "../database/drizzle/db";
import { Members } from "../database/drizzle/drizzleSchemaMySql";
import { AppError } from "../core/appError";
// import { AppError } from "../networking/libs/appError.utils";

export class MemberRepository
  implements IRepository<IMemberBase, IMemberDetails>
{
  async create(data: IMemberBase): Promise<IMemberDetails | undefined> {
    const validatedData = MemberBaseSchema.parse(data);

    // Execution of queries:
    try {
      const [result] = await db
        .insert(Members)
        .values(validatedData as IMember)
        .$returningId();
      if (result.id) {
        const createdMember = await this.getById(result.id);
        return createdMember;
      } else throw new Error("There was a problem while creating the member");
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes("Duplicate entry")) {
          if (err.message.includes("email")) {
            throw new AppError("User with this email already exists", {
              duplicate: "email",
            });
          }
        }
        throw err;
      }
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
        const [result] = await db
          .update(Members)
          .set(validatedMember)
          .where(eq(Members.id, MemberId));
        if (result.affectedRows && result.affectedRows > 0) {
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
        const [result] = await db
          .delete(Members)
          .where(eq(Members.id, memberId));
        if (result.affectedRows && result.affectedRows > 0) {
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
      const [selectedMember] = await db
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
        matchedMembers = await db
          .select()
          .from(Members)
          .where(searchWhereClause)
          .offset(params.offset)
          .limit(params.limit);
      else
        matchedMembers = await db
          .select()
          .from(Members)
          .offset(params.offset)
          .limit(params.limit);
      const [totalMatchedMembers] = await db
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
        [selectedMember] = await db
          .select()
          .from(Members)
          .where(eq(Members.email, emailOrId));
      else
        [selectedMember] = await db
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
