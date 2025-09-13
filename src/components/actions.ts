"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

import {
  ClassFormInputsTypes,
  SubjectFormInputsTypes,
  ExamFormInputsTypes,
  UpdateStudentInputs,
  CreateStudentInputs,
  CreateTeacherInputs,
  UpdateTeacherInputs,
  createTeacherSchema,
  updateTeacherSchema,
  createStudentSchema,
  updateStudentSchema,
  subjectSchema,
  classSchema,
  examSchema,
  CreateParentInputs,
  createParentSchema,
  UpdateParentInputs,
  updateParentSchema,
  LessonFormInputsTypes,
  lessonSchema,
  AssignmentFormInputsTypes,
  assignmentSchema,
  ResultsFormInputsTypes,
  resultsSchema,
  EventFormInputsTypes,
  eventSchema,
  AnnouncementFormInputsTypes,
  announcementSchema,
} from "./formsValidationSchemas";
import { clerkClient } from "@clerk/nextjs/server";
import { getUserId, getUserRole, timeStringToDate } from "@/lib/utils";
import { ZodError } from "zod";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";

type CreateSubjectActionState = { success: boolean; error: boolean };
export type ActionState = {
  success: boolean;
  error: boolean;
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

// Exception handler
const exceptionHandler = (error: unknown): ActionState => {
  if (error instanceof ZodError) {
    return {
      success: false,
      error: true,
      fieldErrors: error.flatten().fieldErrors,
    };
  }

  if (isClerkAPIResponseError(error)) {
    const messages =
      error.errors?.map((err) => err.longMessage || err.message) || [];
    return {
      success: false,
      error: true,
      fieldErrors: {
        clerk: messages,
      },
    };
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      const field = (error?.meta?.target as string[])?.[0];
      return {
        success: false,
        error: true,
        fieldErrors: {
          [field]: [`${field} is already taken`],
        },
      };
    }
  }

  console.error("❌ An unexpected error occurred:", error);
  return {
    success: false,
    error: true,
    message: "Unexpected error occurred",
  };
};

type UserRole = "admin" | "teacher" | "student" | "parent";

// ---------------------------------------------------------------------------------------------------------------------
// Protected Action Utility
// ---------------------------------------------------------------------------------------------------------------------
const protectedAction = async <T>(
  action: (data: T) => Promise<ActionState>,
  data: T,
  requiredRoles: UserRole[] = []
): Promise<ActionState> => {
  const userId = await getUserId();
  const userRole = ((await getUserRole()) as UserRole) || null;

  // Authentication check
  if (!userId) {
    return {
      success: false,
      error: true,
      message: "Unauthorized. Please sign in.",
    };
  }

  // Authorization check
  if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
    return {
      success: false,
      error: true,
      message: "Forbidden. You do not have the necessary permissions.",
    };
  }

  // Execute the protected action
  try {
    return await action(data);
  } catch (error) {
    return exceptionHandler(error);
  }
};
// ---------------------------------------------------------------------------------------------------------------------

// Subject Actions
export const createSubject = async (
  currentState: ActionState,
  data: SubjectFormInputsTypes
) => {
  return protectedAction(
    async (parsedData) => {
      const parsed = subjectSchema.parse(parsedData);
      await prisma.subject.create({
        data: {
          name: parsed.name,
          teachers: {
            connect: parsed.teachers.map((teacherId) => ({
              id: teacherId,
            })),
          },
        },
      });
      return { success: true, error: false };
    },
    data,
    ["admin"]
  );
};

export const updateSubject = async (
  currentState: ActionState,
  data: SubjectFormInputsTypes
) => {
  return protectedAction(
    async (parsedData) => {
      const parsed = subjectSchema.parse(parsedData);
      await prisma.subject.update({
        where: { id: parsed.id },
        data: {
          name: parsed.name,
          teachers: {
            set: parsed.teachers.map((teacherId) => ({
              id: teacherId,
            })),
          },
        },
      });
      return { success: true, error: false };
    },
    data,
    ["admin"]
  );
};

export const deleteSubject = async (
  currentState: ActionState,
  data: FormData
) => {
  return protectedAction(
    async (formData) => {
      const id = formData.get("id") as string;
      if (!id)
        return { success: false, error: true, message: "ID is missing!" };
      await prisma.subject.delete({
        where: { id: +id! },
      });
      return { success: true, error: false };
    },
    data,
    ["admin"]
  );
};

// Class Actions
export const createClass = async (
  currentState: ActionState,
  data: ClassFormInputsTypes
) => {
  return protectedAction(
    async (parsedData) => {
      const parsed = classSchema.parse(parsedData);
      await prisma.class.create({ data: parsed });
      return { success: true, error: false };
    },
    data,
    ["admin"]
  );
};

export const updateClass = async (
  currentState: ActionState,
  data: ClassFormInputsTypes
) => {
  return protectedAction(
    async (parsedData) => {
      const parsed = classSchema.parse(parsedData);
      await prisma.class.update({
        where: { id: parsed.id },
        data: parsed,
      });
      return { success: true, error: false };
    },
    data,
    ["admin"]
  );
};

export const deleteClass = async (
  currentState: ActionState,
  data: FormData
) => {
  return protectedAction(
    async (formData) => {
      const id = formData.get("id") as string;
      if (!id)
        return { success: false, error: true, message: "ID is missing!" };
      await prisma.class.delete({
        where: { id: +id! },
      });
      return { success: true, error: false };
    },
    data,
    ["admin"]
  );
};

// Teacher Actions
export const createTeacher = async (
  currentState: ActionState,
  data: CreateTeacherInputs
) => {
  return protectedAction(
    async (parsedData) => {
      const parsed = createTeacherSchema.parse(parsedData);
      const clerk = await clerkClient();
      const user = await clerk.users.createUser({
        username: parsed.username,
        password: parsed.password,
        firstName: parsed.name,
        lastName: parsed.surname,
        publicMetadata: { role: "teacher" },
      });
      await prisma.teacher.create({
        data: {
          id: user.id,
          username: parsed.username,
          name: parsed.name,
          surname: parsed.surname,
          email: parsed.email,
          phone: parsed.phone,
          address: parsed.address,
          img: parsed.img,
          bloodType: parsed.bloodType,
          sex: parsed.sex,
          subjects: {
            connect: parsed.subjects?.map((subjectId) => ({ id: +subjectId })),
          },
          birthday: parsed.birthday,
        },
      });
      return { success: true, error: false };
    },
    data,
    ["admin"]
  );
};

export const updateTeacher = async (
  currentState: ActionState,
  data: UpdateTeacherInputs
) => {
  return protectedAction(
    async (parsedData) => {
      const parsed = updateTeacherSchema.parse(parsedData);
      const clerk = await clerkClient();
      const user = await clerk.users.updateUser(parsed.id!, {
        ...(parsed.password !== "" && { password: parsed.password }),
        username: parsed.username,
        firstName: parsed.name,
        lastName: parsed.surname,
        publicMetadata: { role: "teacher" },
      });
      await prisma.teacher.update({
        where: { id: parsed.id },
        data: {
          id: user.id,
          username: parsed.username,
          name: parsed.name,
          surname: parsed.surname,
          email: parsed.email,
          phone: parsed.phone,
          address: parsed.address,
          img: parsed.img,
          bloodType: parsed.bloodType,
          sex: parsed.sex,
          subjects: {
            set: parsed.subjects?.map((subjectId) => ({ id: +subjectId })),
          },
          birthday: parsed.birthday,
        },
      });
      return { success: true, error: false };
    },
    data,
    ["admin"]
  );
};

export const deleteTeacher = async (
  currentState: ActionState,
  data: FormData
) => {
  return protectedAction(
    async (formData) => {
      const id = formData.get("id") as string;
      if (!id)
        return { success: false, error: true, message: "ID is missing!" };
      const clerk = await clerkClient();
      await clerk.users.deleteUser(id);
      await prisma.teacher.delete({ where: { id: id } });
      return { success: true, error: false };
    },
    data,
    ["admin"]
  );
};

// Student Actions
export const createStudent = async (
  currentState: ActionState,
  data: CreateStudentInputs
) => {
  return protectedAction(
    async (parsedData) => {
      const parsed = createStudentSchema.parse(parsedData);
      const classItem = await prisma.class.findUnique({
        where: { id: parsed.classId },
        include: { _count: { select: { students: true } } },
      });
      if (classItem && classItem.capacity === classItem._count.students) {
        return { success: false, error: true, message: "Class is full" };
      }
      const clerk = await clerkClient();
      const user = await clerk.users.createUser({
        username: parsed.username,
        password: parsed.password,
        firstName: parsed.name,
        lastName: parsed.surname,
        publicMetadata: { role: "student" },
      });
      await prisma.student.create({
        data: {
          id: user.id,
          username: parsed.username,
          name: parsed.name,
          surname: parsed.surname,
          email: parsed.email,
          phone: parsed.phone,
          address: parsed.address,
          img: parsed.img,
          bloodType: parsed.bloodType,
          sex: parsed.sex,
          birthday: parsed.birthday,
          classId: parsed.classId,
          parentId: parsed.parentId,
          gradeId: parsed.gradeId,
        },
      });
      return { success: true, error: false };
    },
    data,
    ["admin"]
  );
};

export const updateStudent = async (
  currentState: ActionState,
  data: UpdateStudentInputs
) => {
  return protectedAction(
    async (parsedData) => {
      const parsed = updateStudentSchema.parse(parsedData);
      const clerk = await clerkClient();
      const user = await clerk.users.updateUser(parsed.id!, {
        ...(parsed.password !== "" && { password: parsed.password }),
        username: parsed.username,
        firstName: parsed.name,
        lastName: parsed.surname,
        publicMetadata: { role: "student" },
      });
      await prisma.student.update({
        where: { id: parsed.id },
        data: {
          id: user.id,
          username: parsed.username,
          name: parsed.name,
          surname: parsed.surname,
          email: parsed.email,
          phone: parsed.phone,
          address: parsed.address,
          img: parsed.img,
          bloodType: parsed.bloodType,
          sex: parsed.sex,
          birthday: parsed.birthday,
          classId: parsed.classId,
          parentId: parsed.parentId,
          gradeId: parsed.gradeId,
        },
      });
      return { success: true, error: false };
    },
    data,
    ["admin"]
  );
};

export const deleteStudent = async (
  currentState: ActionState,
  data: FormData
) => {
  return protectedAction(
    async (formData) => {
      const id = formData.get("id") as string;
      if (!id)
        return { success: false, error: true, message: "ID is missing!" };
      const clerk = await clerkClient();
      await clerk.users.deleteUser(id);
      await prisma.student.delete({ where: { id: id } });
      return { success: true, error: false };
    },
    data,
    ["admin"]
  );
};

export const createParent = async (
  currentState: ActionState,
  data: CreateParentInputs
) => {
  return protectedAction(
    async (parsedData) => {
      const parsed = createParentSchema.parse(parsedData);
      const clerk = await clerkClient();
      const user = await clerk.users.createUser({
        username: parsed.username,
        password: parsed.password,
        firstName: parsed.name,
        lastName: parsed.surname,
        publicMetadata: { role: "parent" },
      });
      await prisma.parent.create({
        data: {
          id: user.id,
          username: parsed.username,
          name: parsed.name,
          surname: parsed.surname,
          email: parsed.email,
          phone: parsed.phone,
          address: parsed.address,
        },
      });
      return { success: true, error: false };
    },
    data,
    ["admin"]
  );
};

export const updateParent = async (
  currentState: ActionState,
  data: UpdateParentInputs
) => {
  return protectedAction(
    async (parsedData) => {
      const parsed = updateParentSchema.parse(parsedData);
      const clerk = await clerkClient();
      const user = await clerk.users.updateUser(parsed.id!, {
        ...(parsed.password !== "" && { password: parsed.password }),
        username: parsed.username,
        firstName: parsed.name,
        lastName: parsed.surname,
        publicMetadata: { role: "parent" },
      });
      await prisma.parent.update({
        where: { id: parsed.id },
        data: {
          id: user.id,
          username: parsed.username,
          name: parsed.name,
          surname: parsed.surname,
          email: parsed.email,
          phone: parsed.phone,
          address: parsed.address,
        },
      });
      return { success: true, error: false };
    },
    data,
    ["admin"]
  );
};

export const deleteParent = async (
  currentState: ActionState,
  data: FormData
) => {
  return protectedAction(
    async (formData) => {
      const id = formData.get("id") as string;
      if (!id)
        return { success: false, error: true, message: "ID is missing!" };
      const clerk = await clerkClient();
      await clerk.users.deleteUser(id);
      await prisma.parent.delete({ where: { id: id } });
      return { success: true, error: false };
    },
    data,
    ["admin"]
  );
};

// Exam Actions
export const createExam = async (
  currentState: ActionState,
  data: ExamFormInputsTypes
) => {
  return protectedAction(
    async (parsedData) => {
      const role = await getUserRole();
      const userId = await getUserId();
      const parsed = examSchema.parse(parsedData);
      if (role === "teacher") {
        const teacherLesson = await prisma.lesson.findFirst({
          where: {
            teacherId: userId!,
            id: parsed.lessonId,
          },
        });
        if (!teacherLesson) {
          return {
            success: false,
            error: true,
            message: "teachers can add exams only to their own lessons!",
          };
        }
      }
      await prisma.exam.create({
        data: {
          title: parsed.title,
          startTime: parsed.startTime,
          endTime: parsed.endTime,
          lessonId: parsed.lessonId,
        },
      });
      return { success: true, error: false };
    },
    data,
    ["admin", "teacher"]
  );
};

export const updateExam = async (
  currentState: ActionState,
  data: ExamFormInputsTypes
) => {
  return protectedAction(
    async (parsedData) => {
      const role = await getUserRole();
      const userId = await getUserId();
      const parsed = examSchema.parse(parsedData);
      if (role === "teacher") {
        const teacherLesson = await prisma.lesson.findFirst({
          where: {
            teacherId: userId!,
            id: parsedData.lessonId,
          },
        });
        if (!teacherLesson) {
          return {
            success: false,
            error: true,
            message: "teachers can edit only their own exams!",
          };
        }
      }
      await prisma.exam.update({
        where: { id: parsed.id },
        data: {
          title: parsed.title,
          startTime: parsed.startTime,
          endTime: parsed.endTime,
          lessonId: parsed.lessonId,
        },
      });
      return { success: true, error: false };
    },
    data,
    ["admin", "teacher"]
  );
};

export const deleteExam = async (currentState: ActionState, data: FormData) => {
  return protectedAction(
    async (formData) => {
      const id = formData.get("id") as string;
      if (!id)
        return { success: false, error: true, message: "ID is missing!" };
      const role = await getUserRole();
      const userId = await getUserId();
      await prisma.exam.delete({
        where: {
          id: parseInt(id),
          ...(role === "teacher" ? { lesson: { teacherId: userId! } } : {}),
        },
      });
      return { success: true, error: false };
    },
    data,
    ["admin", "teacher"]
  );
};

// Assignment Actions
export const createAssignment = async (
  currentState: ActionState,
  data: AssignmentFormInputsTypes
) => {
  return protectedAction(
    async (parsedData) => {
      const role = await getUserRole();
      const userId = await getUserId();
      const parsed = assignmentSchema.parse(parsedData);
      if (role === "teacher") {
        const teacherLesson = await prisma.lesson.findFirst({
          where: {
            teacherId: userId!,
            id: parsed.lessonId,
          },
        });
        if (!teacherLesson) {
          return {
            success: false,
            error: true,
            message: "teachers can add assignment only to their own lessons!",
          };
        }
      }
      await prisma.assignment.create({
        data: {
          title: parsed.title,
          startDate: parsed.startDate,
          dueDate: parsed.dueDate,
          lessonId: parsed.lessonId,
        },
      });
      return { success: true, error: false };
    },
    data,
    ["admin", "teacher"]
  );
};

export const updateAssignment = async (
  currentState: ActionState,
  data: AssignmentFormInputsTypes
) => {
  return protectedAction(
    async (parsedData) => {
      const role = await getUserRole();
      const userId = await getUserId();
      const parsed = assignmentSchema.parse(parsedData);
      if (role === "teacher") {
        const teacherLesson = await prisma.lesson.findFirst({
          where: {
            teacherId: userId!,
            id: parsedData.lessonId,
          },
        });
        if (!teacherLesson) {
          return {
            success: false,
            error: true,
            message: "teachers can edit only their own assigmnents!",
          };
        }
      }
      await prisma.assignment.update({
        where: { id: parsed.id },
        data: {
          title: parsed.title,
          startDate: parsed.startDate,
          dueDate: parsed.dueDate,
          lessonId: parsed.lessonId,
        },
      });
      return { success: true, error: false };
    },
    data,
    ["admin", "teacher"]
  );
};

export const deleteAssignment = async (
  currentState: CreateSubjectActionState,
  data: FormData
) => {
  return protectedAction(
    async (formData) => {
      const id = formData.get("id") as string;
      if (!id)
        return { success: false, error: true, message: "ID is missing!" };
      const role = await getUserRole();
      const userId = await getUserId();
      await prisma.assignment.delete({
        where: {
          id: parseInt(id),
          ...(role === "teacher" ? { lesson: { teacherId: userId! } } : {}),
        },
      });
      return { success: true, error: false };
    },
    data,
    ["admin", "teacher"]
  );
};

// Lesson Actions
export const createLesson = async (
  currentState: ActionState,
  data: LessonFormInputsTypes
) => {
  return protectedAction(
    async (parsedData) => {
      const parsed = lessonSchema.parse(parsedData);
      await prisma.lesson.create({
        data: {
          day: parsed.day,
          startTime: timeStringToDate(parsed.startTime),
          endTime: timeStringToDate(parsed.endTime),
          subjectId: parsed.subjectId,
          classId: parsed.classId,
          teacherId: parsed.teacherId,
        },
      });
      return { success: true, error: false };
    },
    data,
    ["admin"]
  );
};

export const updateLesson = async (
  currentState: ActionState,
  data: LessonFormInputsTypes
) => {
  return protectedAction(
    async (parsedData) => {
      const parsed = lessonSchema.parse(parsedData);
      await prisma.lesson.update({
        where: { id: parsed.id },
        data: {
          day: parsed.day,
          startTime: timeStringToDate(parsed.startTime),
          endTime: timeStringToDate(parsed.endTime),
          subjectId: parsed.subjectId,
          classId: parsed.classId,
          teacherId: parsed.teacherId,
        },
      });
      return { success: true, error: false };
    },
    data,
    ["admin"]
  );
};

export const deleteLesson = async (
  currentState: ActionState,
  data: FormData
) => {
  return protectedAction(
    async (formData) => {
      const id = formData.get("id") as string;
      if (!id)
        return { success: false, error: true, message: "ID is missing!" };
      await prisma.lesson.delete({
        where: { id: parseInt(id) },
      });
      return { success: true, error: false };
    },
    data,
    ["admin"]
  );
};

// Results Actions
export const createResult = async (
  currentState: ActionState,
  data: ResultsFormInputsTypes
) => {
  return protectedAction(
    async (parsedData) => {
      const role = await getUserRole();
      const userId = await getUserId();
      const parsed = resultsSchema.parse(parsedData);
      if (role === "teacher") {
        const teacherExams = await prisma.exam.findFirst({
          where: {
            id: parsed?.examId,
            lesson: { teacherId: userId! },
          },
        });
        const teacherAssignments = await prisma.assignment.findFirst({
          where: {
            id: parsed?.assignmentId,
            lesson: { teacherId: userId! },
          },
        });
        if (!teacherExams && !teacherAssignments) {
          return {
            success: false,
            error: true,
            message:
              "teachers can add results only their for their own exams/assigmnents!",
          };
        }
      }
      await prisma.result.create({
        data: {
          score: parsed?.score,
          studentId: parsed?.studentId,
          examId: parsed?.examId || null,
          assignmentId: parsed?.assignmentId || null,
        },
      });
      return { success: true, error: false };
    },
    data,
    ["admin", "teacher"]
  );
};

export const updateResult = async (
  currentState: ActionState,
  data: ResultsFormInputsTypes
) => {
  return protectedAction(
    async (parsedData) => {
      const parsed = resultsSchema.parse(parsedData);
      await prisma.result.update({
        where: { id: parsed.id },
        data: {
          score: parsed?.score,
          studentId: parsed?.studentId,
          examId: parsed?.examId || null,
          assignmentId: parsed?.assignmentId || null,
        },
      });
      return { success: true, error: false };
    },
    data,
    ["admin", "teacher"]
  );
};

export const deleteResult = async (
  currentState: ActionState,
  data: FormData
) => {
  return protectedAction(
    async (formData) => {
      const id = formData.get("id") as string;
      if (!id)
        return { success: false, error: true, message: "ID is missing!" };
      await prisma.result.delete({
        where: { id: parseInt(id) },
      });
      return { success: true, error: false };
    },
    data,
    ["admin", "teacher"]
  );
};

// Event Actions
export const createEvent = async (
  currentState: ActionState,
  data: EventFormInputsTypes
) => {
  return protectedAction(
    async (parsedData) => {
      const parsed = eventSchema.parse(parsedData);
      await prisma.event.create({
        data: {
          title: parsed.title,
          description: parsed.description,
          startTime: parsed.startTime,
          endTime: parsed.endTime,
          ...(parsed.classId && { classId: parsed.classId }),
        },
      });
      return { success: true, error: false };
    },
    data,
    ["admin"]
  );
};

export const updateEvent = async (
  currentState: ActionState,
  data: EventFormInputsTypes
) => {
  return protectedAction(
    async (parsedData) => {
      const parsed = eventSchema.parse(parsedData);
      await prisma.event.update({
        where: { id: parsed.id },
        data: {
          title: parsed.title,
          description: parsed.description,
          startTime: parsed.startTime,
          endTime: parsed.endTime,
          ...(parsed.classId && { classId: parsed.classId }),
        },
      });
      return { success: true, error: false };
    },
    data,
    ["admin"]
  );
};

export const deleteEvent = async (
  currentState: ActionState,
  data: FormData
) => {
  return protectedAction(
    async (formData) => {
      const id = formData.get("id") as string;
      if (!id)
        return { success: false, error: true, message: "ID is missing!" };
      await prisma.event.delete({
        where: { id: parseInt(id) },
      });
      return { success: true, error: false };
    },
    data,
    ["admin"]
  );
};

// Announcement Actions
export const createAnnouncement = async (
  currentState: ActionState,
  data: AnnouncementFormInputsTypes
) => {
  return protectedAction(
    async (parsedData) => {
      const parsed = announcementSchema.parse(parsedData);
      await prisma.announcement.create({
        data: {
          title: parsed.title,
          description: parsed.description,
          date: parsed.date,
          ...(parsed.classId && { classId: parsed.classId }),
        },
      });
      return { success: true, error: false };
    },
    data,
    ["admin"]
  );
};

export const updateAnnouncement = async (
  currentState: ActionState,
  data: AnnouncementFormInputsTypes
) => {
  return protectedAction(
    async (parsedData) => {
      const parsed = announcementSchema.parse(parsedData);
      await prisma.announcement.update({
        where: { id: parsed.id },
        data: {
          title: parsed.title,
          description: parsed.description,
          date: parsed.date,
          ...(parsed.classId && { classId: parsed.classId }),
        },
      });
      return { success: true, error: false };
    },
    data,
    ["admin"]
  );
};

export const deleteAnnoucement = async (
  currentState: ActionState,
  data: FormData
) => {
  return protectedAction(
    async (formData) => {
      const id = formData.get("id") as string;
      if (!id)
        return { success: false, error: true, message: "ID is missing!" };
      await prisma.announcement.delete({
        where: { id: parseInt(id) },
      });
      return { success: true, error: false };
    },
    data,
    ["admin"]
  );
};
