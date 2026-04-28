"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import MatchCard from "@/components/matches/MatchCard";
import AdBanner from "@/components/ads/AdBanner";
import { Match } from "@/types";

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/matches")
      .then((r) => r.json())
      .then((data) => {
        setMatches(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <div className="flex items-center gap-2 mb-6">
        <Heart className="w-6 h-6 text-primary-500 fill-primary-500" />
        <h1 className="text-2xl font-bold text-gray-900">Your WorldPals</h1>
        {matches.length > 0 && (
          <span className="ml-auto bg-primary-500 text-gray-900 text-xs font-bold px-2.5 py-1 rounded-full">
            {matches.length}
          </span>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
              <div className="w-14 h-14 rounded-full bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">💛</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No matches yet</h3>
          <p className="text-gray-500 text-sm">
            Keep swiping to find your first WorldPal!
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {matches.map((match, i) => (
            <div key={match.id}>
              <MatchCard
                id={match.id}
                otherUser={match.otherUser}
                lastMessage={match.lastMessage}
                lastMsgAt={match.lastMsgAt}
              />
              {i === 4 && <div className="py-2"><AdBanner /></div>}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <AdBanner />
      </div>
    </div>
  );
}
