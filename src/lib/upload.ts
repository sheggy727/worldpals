import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function saveUploadedFile(file: File, userId: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${userId}-${Date.now()}.${ext}`;
  const filepath = path.join(uploadDir, filename);

  await writeFile(filepath, buffer);
  return `/uploads/${filename}`;
}
