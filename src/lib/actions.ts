"use server";

import { IMember, IMemberBase, IMemberDetails } from "./models/member.model";
import { comparePassword, hashPassword } from "./hashPassword";
import { MemberRepository } from "./memberManagement/member.repository";
// import { MemberSessRepository } from "./memberManagement/memberSess.repository";
import { IPageRequest, ITransactionPageRequest } from "./core/pagination";
import { BookRepository } from "./bookManagement/book.repository";
import { ITransactionBase } from "./models/transaction.model";
import { TransactionRepository } from "./transactionManagement/transaction.repository";
import { AppError } from "./core/appError";
import { IBookBase } from "./models/book.model";
import { ProfessorRepository } from "./memberManagement/professor.repository";
import { IProfessor, IProfessorBase } from "./models/professor.model";
import { revalidatePath } from "next/cache";
import { AppEnvs } from "./core/read-env";
import { z } from "zod";

const memberRepo = new MemberRepository();
const professorRepo = new ProfessorRepository();
const bookRepo = new BookRepository();
const transactionRepo = new TransactionRepository();

export const registerMember = async (newUser: IMemberBase) => {
  try {
    // const { password, ...otherDetails } = details;
    // const hashedPassword = await hashPassword(password);
    // const newUser = { ...otherDetails, password: hashedPassword };
    const result = await memberRepo.create(newUser);
    return "User registered successfully";
  } catch (err) {
    if (err instanceof Error)
      // if (err instanceof AppError)
      throw err;
  }
};

export const authenticateSignin = async (email: string, password: string) => {
  const memberFound = await memberRepo.getAllData(email);
  if (!memberFound) return null;
  // if (memberFound.status === "banned")
  //   throw new AppError(403, "This account has been banned.");
  const isPasswordValid = await comparePassword(password, memberFound.password);
  if (!isPasswordValid) return null;
  return memberFound;
};

// export const storeUserSession = async (id: number, refreshToken: string) => {
//   return memberSessionRepo.create({
//     id,
//     refreshToken,
//   });
// };

export const authenticateGoogleSignin = async (
  email: string,
  refreshToken: string
) => {
  try {
    // Check if the user exists in database
    let user: IMemberDetails | null = (await memberRepo.getAllData(email))!;

    if (!user) {
      return null;
    } else {
      // Store the refresh token in database
      // const session = await storeUserSession(user.id, refreshToken);
      return { id: user.id, role: user.role };
    }
  } catch (error) {
    if (error instanceof Error) throw error;
  }
};

/** Book Actions **/

export const searchBooks = async (request: IPageRequest) => {
  try {
    return bookRepo.list(request);
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
  }
};

export const requestBook = async (transactionRequest: ITransactionBase) => {
  try {
    const response = await transactionRepo.create(transactionRequest);
    if (response) return response.id;
  } catch (err) {
    // if (err instanceof AppError) return err.message;
    if (err instanceof AppError) throw new AppError(err.message);
  }
};

export const createBook = async (newBook: IBookBase) => {
  try {
    return bookRepo.create(newBook);
  } catch (err) {
    if (err instanceof Error) throw err;
  }
};
export const updateBook = async (
  bookId: number,
  changes: Partial<IBookBase>
) => {
  try {
    return bookRepo.update(bookId, changes);
  } catch (err) {
    if (err instanceof Error) throw err;
  }
};

export const deleteBook = async (bookId: number) => {
  try {
    return bookRepo.delete(bookId);
  } catch (err) {
    if (err instanceof Error) throw err;
  }
};

/** Member Actions **/

export const findMember = (emailOrId: string | number) =>
  memberRepo.getAllData(emailOrId);

export const getMembers = async (pageRequest: IPageRequest) => {
  try {
    return memberRepo.list(pageRequest);
  } catch (err) {
    if (err instanceof Error) throw err;
  }
};

export const getProfessors = async (pageRequest: IPageRequest) => {
  try {
    return professorRepo.list(pageRequest);
  } catch (err) {
    if (err instanceof Error) throw err;
  }
};

export const registerProfessor = async (newProfessor: IProfessorBase) => {
  try {
    const result = await professorRepo.create(newProfessor);
    return "User registered successfully";
  } catch (err) {
    if (err instanceof Error) throw err;
  }
};

export const updateProfessor = async (
  professorId: number,
  data: Partial<IProfessorBase>
) => {
  try {
    return professorRepo.update(professorId, data);
  } catch (err) {
    if (err instanceof Error) throw err;
  }
};

export const deleteProfessor = async (MemberId: number) => {
  try {
    return professorRepo.delete(MemberId);
  } catch (err) {
    if (err instanceof Error) throw err;
  }
};

export const updateMember = async (
  MemberId: number,
  data: Partial<IMember>
) => {
  try {
    return memberRepo.update(MemberId, data);
  } catch (err) {
    if (err instanceof Error) throw err;
  }
};

export const updateMemberPassword = async (
  MemberId: number,
  currentPassword: string,
  newPassword: string
) => {
  try {
    const passwordInDb = (await memberRepo.getAllData(MemberId))?.password;
    if (passwordInDb) {
      const isPasswordSame = await comparePassword(
        currentPassword,
        passwordInDb
      );
      if (!isPasswordSame) throw new Error("Passwords don't match");
      const hashedPassword = await hashPassword(newPassword);
      return memberRepo.update(MemberId, { password: hashedPassword });
    } else throw new Error("Internal server problem");
  } catch (err) {
    if (err instanceof Error) throw err;
  }
};

export const deleteMember = async (MemberId: number) => {
  try {
    return memberRepo.delete(MemberId);
  } catch (err) {
    if (err instanceof Error) throw err;
  }
};

/** Transaction Actions **/

export const cancelRequest = async (transactionId: number) => {
  try {
    const response = await transactionRepo.cancel(transactionId);
    if (response) return true;
  } catch (err) {
    if (err instanceof AppError) return false;
    else if (err instanceof Error) throw err;
  }
};

export const approveRequest = async (transactionId: number) => {
  try {
    const response = await transactionRepo.approve(transactionId);
    if (response) return true;
  } catch (err) {
    if (err instanceof AppError) return false;
    else if (err instanceof Error) throw err;
  }
};

export const rejectRequest = async (transactionId: number) => {
  try {
    const response = await transactionRepo.reject(transactionId);
    if (response) return true;
  } catch (err) {
    if (err instanceof AppError) return false;
    else if (err instanceof Error) throw err;
  }
};

export const issueBook = async (transactionId: number) => {
  try {
    const response = await transactionRepo.issue(transactionId);
    if (response) return true;
  } catch (err) {
    if (err instanceof AppError) return false;
    else if (err instanceof Error) throw err;
  }
};

export const returnBook = async (transactionId: number) => {
  try {
    const response = await transactionRepo.update(transactionId);
    if (response) return true;
  } catch (err) {
    if (err instanceof AppError) return false;
    else if (err instanceof Error) throw err;
  }
};

export const getTransactions = async (
  pageRequest: ITransactionPageRequest,
  data?: "dueList"
) => {
  try {
    return data === "dueList"
      ? transactionRepo.dueList(pageRequest)
      : transactionRepo.list(pageRequest);
  } catch (err) {
    if (err instanceof Error) throw err;
  }
};

export const getDueList = async (pageRequest: ITransactionPageRequest) => {
  try {
    return transactionRepo.dueList(pageRequest);
  } catch (err) {
    if (err instanceof Error) throw err;
  }
};

export async function inviteProfessor(
  // prevState: string | undefined,
  data: IProfessorBase
) {
  try {
    // const email = formData.get("email") as string;
    // const data: Omit<IProfessor, "id"> = {
    //   name: formData.get("name") as string,
    //   email: formData.get("email") as string,
    //   department: formData.get("department") as string,
    //   shortBio: formData.get("shortBio") as string,
    //   calendlyLink: null,
    // };

    const orgUri: string = AppEnvs.CALENDLEY_ORGANIZATION_URI;
    const uuid = orgUri.split("/").pop()?.trim();
    let invitationResult;
    if (!data.eventLink)
      invitationResult = await fetch(
        `https://api.calendly.com/organizations/${uuid}/invitations`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${AppEnvs.CALENDLY_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email,
          }),
        }
      );

    if (invitationResult?.ok || data.eventLink) {
      const createdMember = await professorRepo.create(data);
      if (!createdMember) {
        return { message: "Failed in db to create professor." };
      }
      return { message: "Professor created successfully!" };
    }

    return { message: "Failed to invite professor." };
  } catch (err) {
    if (err instanceof Error) {
      return { message: err.message || "Invalid input" };
    }
    // return { message: (err as Error).message };
  }
}

export async function refreshCalendlyLink(email: string) {
  try {
    const orgUri: string = AppEnvs.CALENDLEY_ORGANIZATION_URI;
    const uuid = orgUri.split("/").pop();

    const invitationsResponse = await fetch(
      `https://api.calendly.com/organizations/${uuid}/invitations?email=${encodeURIComponent(
        email
      )}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${AppEnvs.CALENDLY_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!invitationsResponse.ok) {
      throw new Error(
        `Error fetching invitations: ${invitationsResponse.statusText}`
      );
    }

    const invitationsData = await invitationsResponse.json();
    const invitation = invitationsData.collection[0];

    if (invitation && invitation.status === "accepted") {
      const userResponse = await fetch(invitation.user, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${AppEnvs.CALENDLY_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      if (!userResponse.ok) {
        throw new Error(`Error fetching user: ${userResponse.statusText}`);
      }

      const userData = await userResponse.json();
      const calendlyLink = userData.resource.scheduling_url;

      const professor = await professorRepo.getByEmail(email);

      if (professor) {
        await professorRepo.update(professor.id, {
          ...professor,
          eventLink: calendlyLink,
        });
        return {
          success: true,
          message: "Calendly link updated successfully.",
        };
      } else {
        throw new Error("Professor not found in the database.");
      }
    } else {
      return {
        success: false,
        message: "Invitation not accepted or not found.",
      };
    }
  } catch (error) {
    console.error("Error in checkInvitationAndUpdateCalendlyLink:", error);
    throw error;
  } finally {
    revalidatePath("/admin/professors");
  }
}
