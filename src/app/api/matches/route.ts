import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUserId } from "@/lib/api";

export async function GET() {
  const userId = await getAuthUserId();
  if (userId instanceof NextResponse) return userId;

  const matches = await prisma.match.findMany({
    where: { OR: [{ userAId: userId }, { userBId: userId }] },
    orderBy: { lastMsgAt: { sort: "desc", nulls: "last" } },
    include: {
      userA: { select: { id: true, displayName: true, photoPath: true, country: true, languages: true } },
      userB: { select: { id: true, displayName: true, photoPath: true, country: true, languages: true } },
    },
  });

  return NextResponse.json(
    matches.map((m) => {
      const otherUser = m.userAId === userId ? m.userB : m.userA;
      return {
        id: m.id,
        createdAt: m.createdAt,
        lastMessage: m.lastMessage,
        lastMsgAt: m.lastMsgAt,
        otherUser: { ...otherUser, languages: JSON.parse(otherUser.languages) },
      };
    })
  );
}
