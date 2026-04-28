import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUserId } from "@/lib/api";

async function verifyMatchAccess(matchId: string, userId: string) {
  return prisma.match.findFirst({
    where: { id: matchId, OR: [{ userAId: userId }, { userBId: userId }] },
  });
}

export async function GET(req: NextRequest, { params }: { params: { matchId: string } }) {
  const userId = await getAuthUserId();
  if (userId instanceof NextResponse) return userId;

  const match = await verifyMatchAccess(params.matchId, userId);
  if (!match) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const [messages] = await Promise.all([
    prisma.message.findMany({
      where: { matchId: params.matchId },
      orderBy: { createdAt: "asc" },
      take: 100,
      include: { sender: { select: { displayName: true, photoPath: true } } },
    }),
    prisma.message.updateMany({
      where: { matchId: params.matchId, senderId: { not: userId }, read: false },
      data: { read: true },
    }),
  ]);

  return NextResponse.json(messages);
}

export async function POST(req: NextRequest, { params }: { params: { matchId: string } }) {
  const userId = await getAuthUserId();
  if (userId instanceof NextResponse) return userId;

  const match = await verifyMatchAccess(params.matchId, userId);
  if (!match) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { text } = await req.json();
  if (!text?.trim()) return NextResponse.json({ error: "Empty message" }, { status: 400 });

  const [message] = await Promise.all([
    prisma.message.create({
      data: { matchId: params.matchId, senderId: userId, text: text.trim() },
      include: { sender: { select: { displayName: true, photoPath: true } } },
    }),
    prisma.match.update({
      where: { id: params.matchId },
      data: { lastMessage: text.trim(), lastMsgAt: new Date() },
    }),
  ]);

  return NextResponse.json(message, { status: 201 });
}
