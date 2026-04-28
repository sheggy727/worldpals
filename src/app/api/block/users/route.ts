import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUserId, parseUserArrayFields } from "@/lib/api";

export async function GET() {
  const userId = await getAuthUserId();
  if (userId instanceof NextResponse) return userId;

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { blockedUsers: true } });
  if (!user) return NextResponse.json([], { status: 200 });

  const blockedIds: string[] = JSON.parse(user.blockedUsers || "[]");
  if (blockedIds.length === 0) return NextResponse.json([]);

  const users = await prisma.user.findMany({
    where: { id: { in: blockedIds } },
    select: { id: true, displayName: true, photoPath: true, country: true, languages: true, interests: true, countriesWantConnect: true },
  });

  return NextResponse.json(users.map((u) => parseUserArrayFields(u as Parameters<typeof parseUserArrayFields>[0])));
}
