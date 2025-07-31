"use server";

import prisma from "@/lib/prisma";
import { SubjectFormInputsTypes } from "./formsValidationSchemas";
import { revalidatePath } from "next/cache";

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

    revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};
