"use server";

import prisma from "@/lib/prisma";
import {
  ClassFormInputsTypes,
  SubjectFormInputsTypes,
} from "./formsValidationSchemas";

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
