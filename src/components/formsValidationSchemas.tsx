import { z } from "zod";
import { literal } from "zod/v4-mini";

export const subjectSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "subject name is required!" }),
  teachers: z.array(z.string()), //teachersIDs
});

export type SubjectFormInputsTypes = z.infer<typeof subjectSchema>;

export const classSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Clas name is required!" }),
  supervisorId: z.coerce.string().optional(),
  gradeId: z.coerce.number().min(1, { message: "Grade is required!" }),
  capacity: z.coerce.number().min(1, { message: "Capacity is required!" }),
});

export type ClassFormInputsTypes = z.infer<typeof classSchema>;

export const teacherSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username can be 20 characters at most" }),
  password: z
    .string()
    .min(8, { message: "password must be at least 8 characters" })
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "name is required" }),
  surname: z.string().min(1, { message: "surname is required" }),
  phone: z.string().optional(),
  address: z.string().min(1, { message: "Address is required" }),
  bloodType: z.string().min(1, { message: "Blood type is required" }),
  birthday: z.coerce.date({ message: "Birthday is required" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required" }),
  img: z.string().optional(),
  subjects: z.array(z.string()).optional(), // subject ids
});

export type TeacherFormInputsTypes = z.infer<typeof teacherSchema>;

export const studentSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username can be 20 characters at most" }),
  password: z
    .string()
    .min(8, { message: "password must be at least 8 characters" })
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "name is required" }),
  surname: z.string().min(1, { message: "surname is required" }),
  phone: z.string().optional(),
  address: z.string().min(1, { message: "Address is required" }),
  bloodType: z.string().min(1, { message: "Blood type is required" }),
  birthday: z.coerce.date({ message: "Birthday is required" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required" }),
  img: z.string().optional(),
  classId: z.coerce.number(),
  gradeId: z.coerce.number(),
  parentId: z.string(),
});

export type StudentFormInputsTypes = z.infer<typeof studentSchema>;

export const examSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Title name is required!" }),
  startTime: z.coerce.date({ message: "Start time is required!" }),
  endTime: z.coerce.date({ message: "End time is required!" }),
  lessonId: z.coerce.number({ message: "Lesson is required!" }),
});

export type ExamFormInputsTypes = z.infer<typeof examSchema>;
