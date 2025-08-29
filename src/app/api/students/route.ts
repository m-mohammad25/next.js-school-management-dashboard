import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const classId = searchParams.get("classId");

  if (!classId) {
    return NextResponse.json({ error: "classId is required" }, { status: 400 });
  }

  const students = await prisma.student.findMany({
    where: { classId: Number(classId) },
    select: { id: true, name: true, surname: true },
  });

  return NextResponse.json(students);
}
