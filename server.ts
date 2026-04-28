import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server as SocketIOServer } from "socket.io";
import prisma from "./src/lib/prisma";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io = new SocketIOServer(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  io.on("connection", (socket) => {
    socket.on("join-match", (matchId: string) => {
      socket.join(matchId);
    });

    socket.on(
      "send-message",
      async (data: { matchId: string; senderId: string; text: string }) => {
        try {
          const [message] = await Promise.all([
            prisma.message.create({
              data: { matchId: data.matchId, senderId: data.senderId, text: data.text },
              include: { sender: { select: { displayName: true, photoPath: true } } },
            }),
            prisma.match.update({
              where: { id: data.matchId },
              data: { lastMessage: data.text, lastMsgAt: new Date() },
            }),
          ]);
          io.to(data.matchId).emit("receive-message", message);
        } catch (err) {
          console.error("Socket message error:", err);
        }
      }
    );

    socket.on("typing", (data: { matchId: string; userId: string; isTyping: boolean }) => {
      socket.to(data.matchId).emit("typing", data);
    });
  });

  const port = parseInt(process.env.PORT || "3000", 10);
  httpServer.listen(port, () => {
    console.log(`> WorldPals running at http://localhost:${port}`);
  });
});
