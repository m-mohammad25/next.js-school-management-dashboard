import { z } from "zod";

export const subjectSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "subject name is required!" }),
});

export type SubjectFormInputsTypes = z.infer<typeof subjectSchema>;
