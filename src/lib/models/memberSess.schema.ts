import { z } from "zod";

export const MemberSessSchema = z.object({
  id: z.number().int().min(1),
  refreshToken: z
    .string()
    .min(156, { message: "refreshToken must be atleast 156 characters long." }),
});

export type IMemberSessBase = z.input<typeof MemberSessSchema>;
