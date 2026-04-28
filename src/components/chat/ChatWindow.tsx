"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useSocket } from "@/hooks/useSocket";
import { Message } from "@/types";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import LoadingSpinner from "../ui/LoadingSpinner";

interface ChatWindowProps {
  matchId: string;
}

export default function ChatWindow({ matchId }: ChatWindowProps) {
  const { data: session } = useSession();
  const socketRef = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const userId = (session?.user as { id?: string })?.id;

  useEffect(() => {
    fetch(`/api/messages/${matchId}`)
      .then((r) => r.json())
      .then((data) => {
        setMessages(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, [matchId]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !matchId) return;

    socket.emit("join-match", matchId);

    const handleMessage = (msg: Message) => {
      setMessages((prev) => prev.find((m) => m.id === msg.id) ? prev : [...prev, msg]);
    };

    const handleTyping = (data: { userId: string; isTyping: boolean }) => {
      if (data.userId !== userId) setIsTyping(data.isTyping);
    };

    socket.on("receive-message", handleMessage);
    socket.on("typing", handleTyping);

    return () => {
      socket.off("receive-message", handleMessage);
      socket.off("typing", handleTyping);
    };
  }, [matchId, socketRef, userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = useCallback(async (text: string) => {
    if (!text.trim() || !userId) return;

    const socket = socketRef.current;
    if (socket?.connected) {
      socket.emit("send-message", { matchId, senderId: userId, text });
    } else {
      const res = await fetch(`/api/messages/${matchId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const message = await res.json();
      if (message.id) setMessages((prev) => [...prev, message]);
    }
  }, [matchId, userId, socketRef]);

  const handleTypingChange = useCallback((isCurrentlyTyping: boolean) => {
    const socket = socketRef.current;
    if (socket?.connected && userId) {
      socket.emit("typing", { matchId, userId, isTyping: isCurrentlyTyping });
    }
  }, [matchId, userId, socketRef]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3 py-16">
            <div className="text-5xl">👋</div>
            <p className="text-gray-500 font-medium">Say hello to your new WorldPal!</p>
            <p className="text-gray-400 text-sm">Share something interesting about your culture</p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} isOwn={msg.senderId === userId} />
          ))
        )}
        {isTyping && (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <div className="flex gap-1">
              {[0, 0.2, 0.4].map((delay) => (
                <span
                  key={delay}
                  className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                  style={{ animationDelay: `${delay}s` }}
                />
              ))}
            </div>
            <span>typing...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <ChatInput onSend={handleSend} onTyping={handleTypingChange} />
    </div>
  );
}
