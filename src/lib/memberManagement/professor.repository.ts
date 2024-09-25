import { IRepository } from "../core/repository";
import { IMember, IMemberBase, IMemberDetails } from "../models/member.model";
import { MemberBaseSchema } from "../models/member.schema";
import { IPagedResponse, IPageRequest } from "../core/pagination";
import { count, eq, like, or, SQL } from "drizzle-orm";
import { VercelPgDatabase } from "drizzle-orm/vercel-postgres";
import { db } from "../database/drizzle/db";
import { Members, Professors } from "../database/drizzle/drizzleSchemaMySql";
import { AppError } from "../core/appError";
import { hashPassword } from "../hashPassword";
import { IProfessorBase, IProfessor } from "../models/professor.model";
import { ProfessorSchemaBase } from "../models/professor.schema";
// import { AppError } from "../networking/libs/appError.utils";

export class ProfessorRepository
  implements IRepository<IProfessorBase, IProfessor>
{
  async create(data: IProfessorBase): Promise<IProfessor | undefined> {
    const validatedData = ProfessorSchemaBase.parse(data);
    // Execution of queries:
    try {
      const [result] = await db
        .insert(Professors)
        .values(validatedData)
        .$returningId();
      if (result.id) {
        const createdProfessor = await this.getById(result.id);
        return createdProfessor;
      } else throw new Error("There was a problem while creating the member");
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes("Duplicate entry")) {
          if (err.message.includes("email")) {
            throw new AppError("Professor with this email already exists", {
              duplicate: "email",
            });
          }
        }
        throw err;
      }
    }
  }

  async update(
    ProfessorId: number,
    data: Partial<IProfessorBase>
  ): Promise<IProfessor | undefined> {
    // Execution of queries:
    try {
      let oldProfessor = await this.getById(ProfessorId);
      if (oldProfessor) {
        const updatedProfessor = {
          ...oldProfessor,
          ...data,
        };

        const validatedProfessor = ProfessorSchemaBase.parse(updatedProfessor);
        const [result] = await db
          .update(Professors)
          .set(validatedProfessor)
          .where(eq(Professors.id, ProfessorId));
        if (result.affectedRows && result.affectedRows > 0) {
          return updatedProfessor;
        } else
          throw new Error("There was a problem while updating the professor");
      }
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
    }
  }

  async delete(professorId: number): Promise<IProfessor | undefined> {
    // Execution of queries:
    try {
      const deletedProfessor = await this.getById(professorId);
      if (deletedProfessor) {
        const [result] = await db
          .delete(Professors)
          .where(eq(Professors.id, professorId));
        if (result.affectedRows && result.affectedRows > 0) {
          return deletedProfessor;
        } else
          throw new Error("There was a problem while deleting the professor");
      }
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
    }
  }

  async getById(professorId: number): Promise<IProfessor | undefined> {
    // Execution of queries:
    try {
      const [selectedProfessor] = await db
        .select()
        .from(Professors)
        .where(eq(Professors.id, professorId));
      if (!selectedProfessor) throw new Error("Professor not found");
      return selectedProfessor;
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
    }
  }
  async list(
    params: IPageRequest
  ): Promise<IPagedResponse<IProfessor> | undefined> {
    let searchWhereClause: SQL | undefined;
    if (params.search) {
      const search = `%${params.search.toLowerCase()}%`;
      searchWhereClause = or(
        like(Professors.name, search),
        like(Professors.email, search)
      );
    }
    try {
      let matchedProfessors: IProfessor[];
      if (searchWhereClause)
        matchedProfessors = await db
          .select()
          .from(Professors)
          .where(searchWhereClause)
          .offset(params.offset)
          .limit(params.limit);
      else
        matchedProfessors = await db
          .select()
          .from(Professors)
          .offset(params.offset)
          .limit(params.limit);
      const [totalMatchedProfessors] = await db
        .select({ count: count() })
        .from(Professors)
        .where(searchWhereClause);
      return {
        items: matchedProfessors,
        pagination: {
          offset: params.offset,
          limit: params.limit,
          total: totalMatchedProfessors.count,
        },
      };
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
    }
  }
}
