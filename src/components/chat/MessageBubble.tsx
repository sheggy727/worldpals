import { Message } from "@/types";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] px-4 py-2.5 rounded-3xl ${
          isOwn
            ? "bg-primary-500 text-gray-900 rounded-br-sm"
            : "bg-white border border-gray-100 text-gray-900 rounded-bl-sm shadow-sm"
        }`}
      >
        <p className="text-sm leading-relaxed break-words">{message.text}</p>
        <p className={`text-xs mt-1 ${isOwn ? "text-gray-700" : "text-gray-400"} text-right`}>
          {formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}
