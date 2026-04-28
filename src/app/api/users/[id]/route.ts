import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUserId, parseUserArrayFields } from "@/lib/api";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await getAuthUserId();
  if (userId instanceof NextResponse) return userId;

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    select: {
      id: true, displayName: true, photoPath: true, country: true,
      bio: true, age: true, languages: true, interests: true,
      countriesWantConnect: true,
    },
  });

  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(parseUserArrayFields(user as Parameters<typeof parseUserArrayFields>[0]));
}
