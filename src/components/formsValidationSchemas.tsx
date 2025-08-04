import { z } from "zod";

export const subjectSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "subject name is required!" }),
  teachers: z.array(z.string()), //teachersIDs
});

export type SubjectFormInputsTypes = z.infer<typeof subjectSchema>;

export const classSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "subject name is required!" }),
  supervisorId: z.coerce.string().optional(),
  gradeId: z.coerce.number().min(1, { message: "Grade is required!" }),
  capacity: z.coerce.number().min(1, { message: "Capacity is required!" }),
});

export type ClassFormInputsTypes = z.infer<typeof classSchema>;
