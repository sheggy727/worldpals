import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUserId } from "@/lib/api";

export async function POST(req: NextRequest) {
  const userId = await getAuthUserId();
  if (userId instanceof NextResponse) return userId;

  const { reportedId, reason, description } = await req.json();
  if (!reportedId || !reason) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await prisma.report.create({
    data: { reporterId: userId, reportedId, reason, description },
  });

  return NextResponse.json({ success: true });
}
