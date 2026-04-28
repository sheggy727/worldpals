import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { getAuthUserId, parseUserArrayFields } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const { email, password, displayName } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, password: hashed, displayName: displayName || null },
    });

    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const userId = await getAuthUserId();
  if (userId instanceof NextResponse) return userId;

  try {
    const { displayName, bio, age, country, languages, interests, countriesWantConnect, isOnboarded, photoPath } =
      await req.json();

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(displayName !== undefined && { displayName }),
        ...(bio !== undefined && { bio }),
        ...(age !== undefined && { age: Number(age) }),
        ...(country !== undefined && { country }),
        ...(languages !== undefined && { languages: JSON.stringify(languages) }),
        ...(interests !== undefined && { interests: JSON.stringify(interests) }),
        ...(countriesWantConnect !== undefined && { countriesWantConnect: JSON.stringify(countriesWantConnect) }),
        ...(isOnboarded !== undefined && { isOnboarded }),
        ...(photoPath !== undefined && { photoPath }),
      },
    });

    return NextResponse.json({ success: true, user: parseUserArrayFields(updated) });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  const userId = await getAuthUserId();
  if (userId instanceof NextResponse) return userId;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(parseUserArrayFields(user));
}
