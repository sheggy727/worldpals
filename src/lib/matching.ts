import prisma from "./prisma";

export async function recordSwipe(
  senderId: string,
  receiverId: string,
  direction: "like" | "pass"
): Promise<{ matched: boolean; matchId?: string }> {
  await prisma.swipe.upsert({
    where: { senderId_receiverId: { senderId, receiverId } },
    update: { direction },
    create: { senderId, receiverId, direction },
  });

  if (direction !== "like") return { matched: false };

  const reverseSwipe = await prisma.swipe.findUnique({
    where: { senderId_receiverId: { senderId: receiverId, receiverId: senderId } },
  });

  if (!reverseSwipe || reverseSwipe.direction !== "like") return { matched: false };

  const [userAId, userBId] = [senderId, receiverId].sort();
  const existing = await prisma.match.findUnique({
    where: { userAId_userBId: { userAId, userBId } },
  });
  if (existing) return { matched: true, matchId: existing.id };

  const match = await prisma.match.create({ data: { userAId, userBId } });
  return { matched: true, matchId: match.id };
}
