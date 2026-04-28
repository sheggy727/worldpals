"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import SwipeCard from "./SwipeCard";
import ActionButtons from "./ActionButtons";
import { UserProfile } from "@/types";
import AdBanner from "../ads/AdBanner";
import LoadingSpinner from "../ui/LoadingSpinner";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function SwipeDeck() {
  const { data: session } = useSession();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAd, setShowAd] = useState(false);
  const [matchModal, setMatchModal] = useState<{ show: boolean; matchId?: string; name?: string }>({ show: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/users/discover");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProfiles(Array.isArray(data) ? data : []);
      setCurrentIndex(0);
    } catch {
      setError(true);
      toast.error("Failed to load profiles");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session) fetchProfiles();
  }, [session, fetchProfiles]);

  const handleSwipe = async (direction: "like" | "pass") => {
    const user = profiles[currentIndex];
    if (!user) return;

    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);

    if (nextIndex % 5 === 0 && nextIndex > 0) {
      setShowAd(true);
      setTimeout(() => setShowAd(false), 3000);
    }

    const res = await fetch("/api/swipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetId: user.id, direction }),
    });

    const result = await res.json();
    if (result.matched) {
      setMatchModal({ show: true, matchId: result.matchId, name: user.displayName || "Someone" });
    }
  };

  const visibleProfiles = profiles.slice(currentIndex, currentIndex + 3);
  const isEmpty = !loading && !error && (profiles.length === 0 || currentIndex >= profiles.length);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="text-5xl">😕</div>
        <p className="text-gray-500">Failed to load profiles</p>
        <button onClick={fetchProfiles} className="btn-primary">Try again</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <AnimatePresence>
        {showAd && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="px-4 pt-2"
          >
            <AdBanner />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 relative mx-auto w-full max-w-sm px-4 pt-4">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-20">
            <div className="text-6xl">🌍</div>
            <h3 className="text-xl font-bold text-gray-900">You&apos;ve seen everyone!</h3>
            <p className="text-gray-500 text-sm max-w-xs">
              New profiles are added all the time. Check back later or invite friends.
            </p>
            <button onClick={fetchProfiles} className="btn-primary mt-2">
              Refresh profiles
            </button>
          </div>
        ) : (
          <div className="relative h-[480px]">
            <AnimatePresence>
              {visibleProfiles.map((user, i) => (
                <SwipeCard
                  key={user.id}
                  user={user}
                  onSwipe={handleSwipe}
                  isTop={i === 0}
                  index={i}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {!isEmpty && (
        <div className="pb-4">
          <ActionButtons
            onPass={() => handleSwipe("pass")}
            onLike={() => handleSwipe("like")}
          />
        </div>
      )}

      <AnimatePresence>
        {matchModal.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => setMatchModal({ show: false })}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="bg-white rounded-4xl p-8 text-center max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-6xl mb-4 animate-bounce">🎉</div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-primary-500" />
                <h2 className="text-2xl font-extrabold text-gray-900">It&apos;s a match!</h2>
                <Sparkles className="w-5 h-5 text-primary-500" />
              </div>
              <p className="text-gray-500 mb-6">
                You and <strong className="text-gray-900">{matchModal.name}</strong> both want to be WorldPals!
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href={`/chat/${matchModal.matchId}`}
                  className="btn-primary flex items-center justify-center"
                  onClick={() => setMatchModal({ show: false })}
                >
                  Start chatting 💬
                </Link>
                <button onClick={() => setMatchModal({ show: false })} className="btn-ghost">
                  Keep swiping
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
