import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUserId, parseUserArrayFields } from "@/lib/api";

export async function GET() {
  const userId = await getAuthUserId();
  if (userId instanceof NextResponse) return userId;

  const currentUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!currentUser) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const blocked: string[] = JSON.parse(currentUser.blockedUsers || "[]");

  const swipesSent = await prisma.swipe.findMany({
    where: { senderId: userId },
    select: { receiverId: true },
  });
  const excludeIds = [userId, ...swipesSent.map((s) => s.receiverId), ...blocked];

  const users = await prisma.user.findMany({
    where: {
      id: { notIn: excludeIds },
      isOnboarded: true,
      NOT: { blockedUsers: { contains: userId } },
    },
    select: {
      id: true,
      displayName: true,
      photoPath: true,
      bio: true,
      age: true,
      country: true,
      languages: true,
      interests: true,
      countriesWantConnect: true,
    },
    take: 20,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(users.map(parseUserArrayFields));
}
