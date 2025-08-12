"use server";

import prisma from "@/lib/prisma";
import {
  ClassFormInputsTypes,
  StudentFormInputsTypes,
  SubjectFormInputsTypes,
  TeacherFormInputsTypes,
  ExamFormInputsTypes,
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
  data: TeacherFormInputsTypes
) => {
  try {
    const clerk = await clerkClient();
    const user = await clerk.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: "teacher" },
    });

    await prisma.teacher.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        address: data.address,
        img: data.img,
        bloodType: data.bloodType,
        sex: data.sex,
        subjects: {
          connect: data.subjects?.map((subjectId) => ({ id: +subjectId })),
        },
        birthday: data.birthday,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export const updateTeacher = async (
  currentState: CreateSubjectActionState,
  data: TeacherFormInputsTypes
) => {
  try {
    if (!data.id) return { success: false, error: true };

    const clerk = await clerkClient();
    const user = await clerk.users.updateUser(data.id, {
      ...(data.password !== "" && { password: data.password }),
      username: data.username,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: "teacher" },
    });

    await prisma.teacher.update({
      where: { id: data.id },
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        address: data.address,
        img: data.img,
        bloodType: data.bloodType,
        sex: data.sex,
        subjects: {
          set: data.subjects?.map((subjectId) => ({ id: +subjectId })),
        },
        birthday: data.birthday,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.log(error);
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
  data: StudentFormInputsTypes
) => {
  try {
    const classItem = await prisma.class.findUnique({
      where: { id: data.classId },
      include: { _count: { select: { students: true } } },
    });

    if (classItem && classItem.capacity === classItem._count.students) {
      // class is full
      return { success: false, error: false };
    }
    const clerk = await clerkClient();
    const user = await clerk.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: "student" },
    });

    await prisma.student.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        address: data.address,
        img: data.img,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        classId: data.classId,
        parentId: data.parentId,
        gradeId: data.gradeId,
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
  data: StudentFormInputsTypes
) => {
  try {
    if (!data.id) return { success: false, error: true };

    const clerk = await clerkClient();
    const user = await clerk.users.updateUser(data.id, {
      ...(data.password !== "" && { password: data.password }),
      username: data.username,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: "student" },
    });

    await prisma.student.update({
      where: { id: data.id },
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        address: data.address,
        img: data.img,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        classId: data.classId,
        parentId: data.parentId,
        gradeId: data.gradeId,
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
