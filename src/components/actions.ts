"use server";

import prisma from "@/lib/prisma";
import { SubjectFormInputsTypes } from "./formsValidationSchemas";

type CreateSubjectActionState = { success: boolean; error: boolean };

export const createSubject = async (
  currentState: CreateSubjectActionState,
  data: SubjectFormInputsTypes
) => {
  try {
    await prisma.subject.create({
      data: {
        name: data.name,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.log(error);
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
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export const deleteSubject = async (
  currentState: CreateSubjectActionState,
  data: FormData
) => {
  console.log("hello from delete action!");
  try {
    await prisma.subject.delete({
      where: { id: +data.get("id")! },
    });

    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};
