import Link from "next/link";
import Image from "next/image";
import { COUNTRY_FLAGS } from "@/types";

interface MatchCardProps {
  id: string;
  otherUser: {
    id: string;
    displayName: string | null;
    photoPath: string | null;
    country: string | null;
    languages: string[];
  };
  lastMessage: string | null;
  lastMsgAt: string | null;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function MatchCard({ id, otherUser, lastMessage, lastMsgAt }: MatchCardProps) {
  const flag = COUNTRY_FLAGS[otherUser.country || ""] || "🌍";

  return (
    <Link href={`/chat/${id}`}>
      <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer">
        <div className="relative w-14 h-14 shrink-0">
          {otherUser.photoPath ? (
            <Image
              src={otherUser.photoPath}
              alt={otherUser.displayName || "User"}
              fill
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-2xl">😊</span>
            </div>
          )}
          <span className="absolute -bottom-1 -right-1 text-base">{flag}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 truncate">
              {otherUser.displayName || "WorldPal"}
            </h3>
            {lastMsgAt && (
              <span className="text-xs text-gray-400 shrink-0 ml-2">{timeAgo(lastMsgAt)}</span>
            )}
          </div>
          <p className="text-sm text-gray-400 truncate mt-0.5">
            {lastMessage || "Say hello! 👋"}
          </p>
          {otherUser.languages.length > 0 && (
            <div className="flex gap-1 mt-1">
              {otherUser.languages.slice(0, 2).map((lang) => (
                <span key={lang} className="text-xs bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full">
                  {lang}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
