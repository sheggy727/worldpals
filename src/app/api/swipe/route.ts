import { NextRequest, NextResponse } from "next/server";
import { recordSwipe } from "@/lib/matching";
import { getAuthUserId } from "@/lib/api";

export async function POST(req: NextRequest) {
  const userId = await getAuthUserId();
  if (userId instanceof NextResponse) return userId;

  const { targetId, direction } = await req.json();

  if (!targetId || !["like", "pass"].includes(direction)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const result = await recordSwipe(userId, targetId, direction);
  return NextResponse.json(result);
}
