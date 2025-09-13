import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // or your DB client

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const id = searchParams.get("id") || "";

  let parents = null;
  if (search) {
    parents = await prisma.parent.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { surname: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { phone: { contains: search, mode: "insensitive" } },
        ],
      },
      take: 10, // limit results
      select: { id: true, name: true, surname: true, email: true, phone: true },
    });
  }

  if (id) {
    parents = await prisma.parent.findFirst({
      where: {
        id,
      },
    });
  }

  return NextResponse.json(parents);
}
