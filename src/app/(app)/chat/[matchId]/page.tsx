"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Flag } from "lucide-react";
import Image from "next/image";
import { COUNTRY_FLAGS } from "@/types";
import ChatWindow from "@/components/chat/ChatWindow";
import ReportModal from "@/components/safety/ReportModal";

interface OtherUser {
  id: string;
  displayName: string | null;
  photoPath: string | null;
  country: string | null;
}

export default function ChatPage() {
  const { matchId } = useParams<{ matchId: string }>();
  const router = useRouter();
  const [otherUser, setOtherUser] = useState<OtherUser | null>(null);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    fetch("/api/matches")
      .then((r) => r.json())
      .then((matches) => {
        const match = matches.find((m: { id: string; otherUser: OtherUser }) => m.id === matchId);
        if (match) setOtherUser(match.otherUser);
      });
  }, [matchId]);

  const flag = COUNTRY_FLAGS[otherUser?.country || ""] || "🌍";

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100">
        <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>

        <div className="relative w-10 h-10">
          {otherUser?.photoPath ? (
            <Image src={otherUser.photoPath} alt="User" fill className="rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-xl">😊</span>
            </div>
          )}
          <span className="absolute -bottom-0.5 -right-0.5 text-sm">{flag}</span>
        </div>

        <div className="flex-1">
          <p className="font-semibold text-gray-900">{otherUser?.displayName || "WorldPal"}</p>
          <p className="text-xs text-gray-400">{otherUser?.country || ""}</p>
        </div>

        <button
          onClick={() => setShowReport(true)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          title="Report user"
        >
          <Flag className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <ChatWindow matchId={matchId} />

      {otherUser && showReport && (
        <ReportModal
          reportedId={otherUser.id}
          reportedName={otherUser.displayName || "WorldPal"}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  );
}
