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
} from "./formsValidationSchemas";
import { clerkClient } from "@clerk/nextjs/server";
import { getUserId, getUserRole } from "@/lib/utils";
import { ZodError } from "zod";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { success } from "zod/v4-mini";

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
      // Unique constraint failed
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

  console.error("❌ createTeacher error:", error);
  return {
    success: false,
    error: true,
    message: "Unexpected error occurred",
  };
};
// Subject Actions

export const createSubject = async (
  currentState: ActionState,
  data: SubjectFormInputsTypes
) => {
  const parsed = subjectSchema.parse(data);

  try {
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
  } catch (error) {
    return exceptionHandler(error);
  }
};

export const updateSubject = async (
  currentState: ActionState,
  data: SubjectFormInputsTypes
) => {
  const parsed = subjectSchema.parse(data);

  try {
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
  } catch (error) {
    return exceptionHandler(error);
  }
};

export const deleteSubject = async (
  currentState: CreateSubjectActionState,
  data: FormData
) => {
  const id = data.get("id") as string;
  if (!id) return { success: false, error: true };

  try {
    await prisma.subject.delete({
      where: { id: +id! },
    });

    return { success: true, error: false };
  } catch (error) {
    return exceptionHandler(error);
  }
};

// Class Actions

export const createClass = async (
  currentState: ActionState,
  data: ClassFormInputsTypes
) => {
  const parsed = classSchema.parse(data);

  try {
    await prisma.class.create({
      data: parsed,
    });

    return { success: true, error: false };
  } catch (error) {
    return exceptionHandler(error);
  }
};

export const updateClass = async (
  currentState: ActionState,
  data: ClassFormInputsTypes
) => {
  const parsed = classSchema.parse(data);

  try {
    await prisma.class.update({
      where: { id: parsed.id },
      data: parsed,
    });

    return { success: true, error: false };
  } catch (error) {
    return exceptionHandler(error);
  }
};

export const deleteClass = async (
  currentState: ActionState,
  data: FormData
) => {
  const id = data.get("id") as string;
  if (!id) return { success: false, error: true };

  try {
    await prisma.class.delete({
      where: { id: +id! },
    });

    return { success: true, error: false };
  } catch (error) {
    return exceptionHandler(error);
  }
};

// Teacher Actions

export const createTeacher = async (
  currentState: ActionState,
  data: CreateTeacherInputs
) => {
  try {
    // ✅ Validate inputs on the server
    const parsed = createTeacherSchema.parse(data);

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
  } catch (error) {
    return exceptionHandler(error);
  }
};

export const updateTeacher = async (
  currentState: ActionState,
  data: UpdateTeacherInputs
) => {
  try {
    // ✅ Validate inputs on the server
    const parsed = updateTeacherSchema.parse(data);

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
  } catch (error) {
    return exceptionHandler(error);
  }
};

export const deleteTeacher = async (
  currentState: ActionState,
  data: FormData
) => {
  const id = data.get("id") as string;
  if (!id) return { success: false, error: true };

  try {
    const clerk = await clerkClient();
    await clerk.users.deleteUser(id);

    await prisma.teacher.delete({
      where: { id: id },
    });

    return { success: true, error: false };
  } catch (error) {
    return exceptionHandler(error);
  }
};

// Student Actions

export const createStudent = async (
  currentState: ActionState,
  data: CreateStudentInputs
) => {
  try {
    const parsed = createStudentSchema.parse(data);

    const classItem = await prisma.class.findUnique({
      where: { id: parsed.classId },
      include: { _count: { select: { students: true } } },
    });

    if (classItem && classItem.capacity === classItem._count.students) {
      // class is full
      return { success: false, error: false, message: "Class is full" };
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
  } catch (error) {
    return exceptionHandler(error);
  }
};

export const updateStudent = async (
  currentState: ActionState,
  data: UpdateStudentInputs
) => {
  try {
    const parsed = updateStudentSchema.parse(data);

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
  } catch (error) {
    return exceptionHandler(error);
  }
};

export const deleteStudent = async (
  currentState: CreateSubjectActionState,
  data: FormData
) => {
  const id = data.get("id") as string;
  if (!id) return { success: false, error: true, message: "ID is missing!" };

  try {
    const clerk = await clerkClient();
    await clerk.users.deleteUser(id);

    await prisma.student.delete({
      where: { id: id },
    });

    return { success: true, error: false };
  } catch (error) {
    return exceptionHandler(error);
  }
};

export const createParent = async (
  currentState: ActionState,
  data: CreateParentInputs
) => {
  try {
    const parsed = createParentSchema.parse(data);

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
  } catch (error) {
    return exceptionHandler(error);
  }
};

export const updateParent = async (
  currentState: ActionState,
  data: UpdateParentInputs
) => {
  try {
    const parsed = updateParentSchema.parse(data);

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
  } catch (error) {
    return exceptionHandler(error);
  }
};

export const deleteParent = async (
  currentState: CreateSubjectActionState,
  data: FormData
) => {
  const id = data.get("id") as string;
  if (!id) return { success: false, error: true, message: "ID is missing!" };

  try {
    const clerk = await clerkClient();
    await clerk.users.deleteUser(id);

    await prisma.parent.delete({
      where: { id: id },
    });

    return { success: true, error: false };
  } catch (error) {
    return exceptionHandler(error);
  }
};

// Exam Actions
export const createExam = async (
  currentState: ActionState,
  data: ExamFormInputsTypes
) => {
  const role = await getUserRole();
  const userId = await getUserId();

  const parsed = examSchema.parse(data);

  try {
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

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    return exceptionHandler(err);
  }
};

// exam actions

export const updateExam = async (
  currentState: ActionState,
  data: ExamFormInputsTypes
) => {
  const role = await getUserRole();
  const userId = await getUserId();

  const parsed = examSchema.parse(data);

  try {
    if (role === "teacher") {
      const teacherLesson = await prisma.lesson.findFirst({
        where: {
          teacherId: userId!,
          id: data.lessonId,
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
      where: {
        id: parsed.id,
      },
      data: {
        title: parsed.title,
        startTime: parsed.startTime,
        endTime: parsed.endTime,
        lessonId: parsed.lessonId,
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    return exceptionHandler(err);
  }
};

export const deleteExam = async (
  currentState: CreateSubjectActionState,
  data: FormData
) => {
  const id = data.get("id") as string;
  if (!id) return { success: false, error: true, message: "ID is missing!" };

  const role = await getUserRole();
  const userId = await getUserId();

  try {
    await prisma.exam.delete({
      where: {
        id: parseInt(id),
        ...(role === "teacher" ? { lesson: { teacherId: userId! } } : {}),
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    return exceptionHandler(err);
  }
};
