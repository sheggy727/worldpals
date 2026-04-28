import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";

/** Returns the authenticated user's ID, or a 401 response if unauthenticated. */
export async function getAuthUserId(): Promise<string | NextResponse> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return (session.user as { id: string }).id;
}

/** Parse a User row's JSON string columns into arrays. */
export function parseUserArrayFields<T extends {
  languages: string;
  interests?: string;
  countriesWantConnect?: string;
  blockedUsers?: string;
}>(user: T) {
  return {
    ...user,
    languages: JSON.parse(user.languages) as string[],
    interests: user.interests !== undefined ? JSON.parse(user.interests) as string[] : undefined,
    countriesWantConnect: user.countriesWantConnect !== undefined
      ? JSON.parse(user.countriesWantConnect) as string[]
      : undefined,
    blockedUsers: user.blockedUsers !== undefined
      ? JSON.parse(user.blockedUsers) as string[]
      : undefined,
    password: undefined,
  };
}
