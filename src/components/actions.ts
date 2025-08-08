"use server";

import prisma from "@/lib/prisma";
import {
  ClassFormInputsTypes,
  SubjectFormInputsTypes,
  TeacherFormInputsTypes,
} from "./formsValidationSchemas";
import { clerkClient } from "@clerk/nextjs/server";

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
    console.log("hey before");
    console.log(data);
    const clerk = await clerkClient();
    const user = await clerk.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: "teacher" },
    });

    console.log("hey after");
    console.log(user);
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
    await prisma.teacher.update({
      where: { id: data.id },
      data,
    });

    return { success: true, error: false };
  } catch (error) {
    return { success: false, error: true };
  }
};

export const deleteTeacher = async (
  currentState: CreateSubjectActionState,
  data: FormData
) => {
  try {
    await prisma.teacher.delete({
      where: { id: +data.get("id")! },
    });

    return { success: true, error: false };
  } catch (error) {
    return { success: false, error: true };
  }
};
