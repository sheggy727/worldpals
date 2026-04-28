import { NextRequest, NextResponse } from "next/server";
import { saveUploadedFile } from "@/lib/upload";
import { getAuthUserId } from "@/lib/api";

const VALID_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const userId = await getAuthUserId();
  if (userId instanceof NextResponse) return userId;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (!VALID_IMAGE_TYPES.includes(file.type))
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    if (file.size > MAX_FILE_SIZE)
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });

    const path = await saveUploadedFile(file, userId);
    return NextResponse.json({ path });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
