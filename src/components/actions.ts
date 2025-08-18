"use server";

import prisma from "@/lib/prisma";
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
} from "./formsValidationSchemas";
import { clerkClient } from "@clerk/nextjs/server";
import { getUserId, getUserRole } from "@/lib/utils";

type CreateSubjectActionState = { success: boolean; error: boolean };

// Subject Actions

export const createSubject = async (
  currentState: CreateSubjectActionState,
  data: SubjectFormInputsTypes
) => {
  try {
    await prisma.subject.create({
      data: {
        name: data.name,
        teachers: {
          connect: data.teachers.map((teacherId) => ({
            id: teacherId,
          })),
        },
      },
    });

    return { success: true, error: false };
  } catch (error) {
    return { success: false, error: true };
  }
};

export const updateSubject = async (
  currentState: CreateSubjectActionState,
  data: SubjectFormInputsTypes
) => {
  try {
    await prisma.subject.update({
      where: { id: data.id },
      data: {
        name: data.name,
        teachers: {
          set: data.teachers.map((teacherId) => ({
            id: teacherId,
          })),
        },
      },
    });

    return { success: true, error: false };
  } catch (error) {
    return { success: false, error: true };
  }
};

export const deleteSubject = async (
  currentState: CreateSubjectActionState,
  data: FormData
) => {
  try {
    await prisma.subject.delete({
      where: { id: +data.get("id")! },
    });

    return { success: true, error: false };
  } catch (error) {
    return { success: false, error: true };
  }
};

// Class Actions

export const createClass = async (
  currentState: CreateSubjectActionState,
  data: ClassFormInputsTypes
) => {
  try {
    await prisma.class.create({
      data,
    });

    return { success: true, error: false };
  } catch (error) {
    return { success: false, error: true };
  }
};

export const updateClass = async (
  currentState: CreateSubjectActionState,
  data: ClassFormInputsTypes
) => {
  try {
    await prisma.class.update({
      where: { id: data.id },
      data,
    });

    return { success: true, error: false };
  } catch (error) {
    return { success: false, error: true };
  }
};

export const deleteClass = async (
  currentState: CreateSubjectActionState,
  data: FormData
) => {
  try {
    await prisma.class.delete({
      where: { id: +data.get("id")! },
    });

    return { success: true, error: false };
  } catch (error) {
    return { success: false, error: true };
  }
};

// Teacher Actions

export const createTeacher = async (
  currentState: CreateSubjectActionState,
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
    console.error("❌ createTeacher error:", error);
    return { success: false, error: true };
  }
};

export const updateTeacher = async (
  currentState: CreateSubjectActionState,
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
    console.error("❌ updateTeacher error:", error);
    return { success: false, error: true };
  }
};

export const deleteTeacher = async (
  currentState: CreateSubjectActionState,
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
    return { success: false, error: true };
  }
};
// Student Actions

export const createStudent = async (
  currentState: CreateSubjectActionState,
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
      return { success: false, error: false };
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
    console.log(error);
    return { success: false, error: true };
  }
};

export const updateStudent = async (
  currentState: CreateSubjectActionState,
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
    console.log(error);
    return { success: false, error: true };
  }
};

export const deleteStudent = async (
  currentState: CreateSubjectActionState,
  data: FormData
) => {
  const id = data.get("id") as string;
  if (!id) return { success: false, error: true };

  try {
    const clerk = await clerkClient();
    await clerk.users.deleteUser(id);

    await prisma.student.delete({
      where: { id: id },
    });

    return { success: true, error: false };
  } catch (error) {
    return { success: false, error: true };
  }
};

export const createExam = async (
  currentState: CreateSubjectActionState,
  data: ExamFormInputsTypes
) => {
  const role = await getUserRole();
  const userId = await getUserId();

  try {
    if (role === "teacher") {
      const teacherLesson = await prisma.lesson.findFirst({
        where: {
          teacherId: userId!,
          id: data.lessonId,
        },
      });

      if (!teacherLesson) {
        return { success: false, error: true };
      }
    }

    await prisma.exam.create({
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: data.lessonId,
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

// exam actions

export const updateExam = async (
  currentState: CreateSubjectActionState,
  data: ExamFormInputsTypes
) => {
  const role = await getUserRole();
  const userId = await getUserId();

  try {
    if (role === "teacher") {
      const teacherLesson = await prisma.lesson.findFirst({
        where: {
          teacherId: userId!,
          id: data.lessonId,
        },
      });

      if (!teacherLesson) {
        return { success: false, error: true };
      }
    }

    await prisma.exam.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: data.lessonId,
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteExam = async (
  currentState: CreateSubjectActionState,
  data: FormData
) => {
  const id = data.get("id") as string;

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
    console.log(err);
    return { success: false, error: true };
  }
};
