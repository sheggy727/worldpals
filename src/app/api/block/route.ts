import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUserId } from "@/lib/api";

export async function POST(req: NextRequest) {
  const userId = await getAuthUserId();
  if (userId instanceof NextResponse) return userId;

  const { targetId, unblock } = await req.json();

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { blockedUsers: true } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const blocked: string[] = JSON.parse(user.blockedUsers || "[]");
  const updated = unblock
    ? blocked.filter((id) => id !== targetId)
    : blocked.includes(targetId) ? blocked : [...blocked, targetId];

  await prisma.user.update({ where: { id: userId }, data: { blockedUsers: JSON.stringify(updated) } });

  return NextResponse.json({ success: true, blockedUsers: updated });
}
