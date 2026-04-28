"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (text: string) => void;
  onTyping: (isTyping: boolean) => void;
}

export default function ChatInput({ onSend, onTyping }: ChatInputProps) {
  const [text, setText] = useState("");
  const typingTimer = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    onTyping(true);

    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => onTyping(false), 1500);
  };

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
    onTyping(false);
    if (typingTimer.current) clearTimeout(typingTimer.current);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimer.current) clearTimeout(typingTimer.current);
    };
  }, []);

  return (
    <div className="px-4 py-3 bg-white border-t border-gray-100">
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Say something..."
          className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
          maxLength={1000}
        />
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className="w-11 h-11 rounded-full bg-primary-500 flex items-center justify-center disabled:opacity-40 hover:bg-primary-600 transition-colors active:scale-90"
        >
          <Send className="w-5 h-5 text-gray-900" />
        </button>
      </div>
    </div>
  );
}
