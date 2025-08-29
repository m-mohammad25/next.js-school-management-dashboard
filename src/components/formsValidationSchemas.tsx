import { z } from "zod";

export const subjectSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "subject name is required!" }),
  teachers: z
    .array(z.string(), {
      //teachersIDs
      required_error: "You must select at least one teacher",
    })
    .min(1, "You must select at least one teacher"),
});

export type SubjectFormInputsTypes = z.infer<typeof subjectSchema>;

export const classSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Class name is required!" }),
  supervisorId: z.coerce.string().optional(),
  gradeId: z.coerce.number().min(1, { message: "Grade is required!" }),
  capacity: z.coerce.number().min(1, { message: "Capacity is required!" }),
});

export type ClassFormInputsTypes = z.infer<typeof classSchema>;

export const baseTeacherSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username can be 20 characters at most" }),
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

export const createTeacherSchema = baseTeacherSchema.extend({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export const updateTeacherSchema = baseTeacherSchema.extend({
  password: z.string().min(8).optional().or(z.literal("")),
});

export type CreateTeacherInputs = z.infer<typeof createTeacherSchema>;
export type UpdateTeacherInputs = z.infer<typeof updateTeacherSchema>;

// Base schema shared by both
const baseStudentSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username can be 20 characters at most" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "Name is required" }),
  surname: z.string().min(1, { message: "Surname is required" }),
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

// Create schema → password required
export const createStudentSchema = baseStudentSchema.extend({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

// Update schema → password optional
export const updateStudentSchema = baseStudentSchema.extend({
  password: z.string().min(8).optional().or(z.literal("")),
});

export type CreateStudentInputs = z.infer<typeof createStudentSchema>;
export type UpdateStudentInputs = z.infer<typeof updateStudentSchema>;

const baseParentSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username can be 20 characters at most" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "Name is required" }),
  surname: z.string().min(1, { message: "Surname is required" }),
  phone: z.string(),
  address: z.string().min(1, { message: "Address is required" }),
});

// Create schema → password required
export const createParentSchema = baseParentSchema.extend({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

// Update schema → password optional
export const updateParentSchema = baseParentSchema.extend({
  password: z.string().min(8).optional().or(z.literal("")),
});

export type CreateParentInputs = z.infer<typeof createParentSchema>;
export type UpdateParentInputs = z.infer<typeof updateParentSchema>;

export const examSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Title name is required!" }),
  startTime: z.coerce.date({ message: "Start time is required!" }),
  endTime: z.coerce.date({ message: "End time is required!" }),
  lessonId: z.coerce.number({ message: "Lesson is required!" }),
});

export type ExamFormInputsTypes = z.infer<typeof examSchema>;

export const lessonSchema = z.object({
  id: z.coerce.number().optional(),
  // name: z.string().min(1, { message: "Title name is required!" }),
  day: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]),
  // startTime: z.coerce.date({ message: "Start time is required!" }),
  // endTime: z.coerce.date({ message: "End time is required!" }),
  startTime: z
    .string()
    .min(1, { message: "Start time is required!" })
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: "Invalid time format. Use HH:MM",
    }),
  endTime: z
    .string()
    .min(1, { message: "End time is required!" })
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: "Invalid time format. Use HH:MM",
    }),
  subjectId: z.coerce.number().min(1, "Please select a subject!"),
  classId: z.coerce.number().min(1, "Please select a class!"),
  teacherId: z.string().min(1, "Please select a teacher!"),
});

export type LessonFormInputsTypes = z.infer<typeof lessonSchema>;

export const assignmentSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Title name is required!" }),
  startDate: z.coerce.date({ message: "Start time is required!" }),
  dueDate: z.coerce.date({ message: "End time is required!" }),
  lessonId: z.coerce.number({ message: "Lesson is required!" }),
});

export type AssignmentFormInputsTypes = z.infer<typeof assignmentSchema>;

export const resultsSchema = z
  .object({
    id: z.coerce
      .number({
        required_error: "Score is required",
        invalid_type_error: "Score must be a number",
      })
      .optional(),
    score: z.coerce
      .number()
      .min(0, { message: "score could not be less that 0" })
      .max(100, { message: "score could not be more that 100" }),
    studentId: z.string().min(1, { message: "please select a student" }),
    examId: z.coerce.number().optional(),
    assignmentId: z.coerce.number().optional(),
  })
  .refine(
    (data) => !(data.examId && data.assignmentId), // cannot have both
    {
      message: "You cannot select both an exam and an assignment",
      path: ["examId"],
    }
  )
  .refine(
    (data) => data.examId || data.assignmentId, // at least one required
    {
      message: "You must select either an exam or an assignment",
      path: ["examId"],
    }
  );

export type ResultsFormInputsTypes = z.infer<typeof resultsSchema>;
