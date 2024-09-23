import { z } from "zod";

export const ProfessorSchemaBase = z.object({
  name: z.string().max(255, "Name must be at most 255 characters long"),
  email: z
    .string()
    .email("Invalid email format")
    .max(255, "Email must be at most 255 characters long"),
  department: z
    .string()
    .max(255, "Department must be at most 255 characters long"),
  shortBio: z
    .string()
    .max(255, "Short bio must be at most 255 characters long")
    .nullable(),
  eventLink: z
    .string()
    .url("Invalid URL format")
    .max(255, "Event link must be at most 255 characters long")
    .nullable(),
});

export const ProfessorSchema = ProfessorSchemaBase.extend({
  id: z.number().int().min(1),
});
