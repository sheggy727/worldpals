"use client";

import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { Shield, LogOut, UserX, Globe, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import { COUNTRY_FLAGS } from "@/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface BlockedUser {
  id: string;
  displayName: string | null;
  photoPath: string | null;
  country: string | null;
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [blockedCount, setBlockedCount] = useState(0);
  const [showBlocked, setShowBlocked] = useState(false);
  const [loadingBlocked, setLoadingBlocked] = useState(false);

  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then((u) => setBlockedCount((u.blockedUsers || []).length));
  }, []);

  const toggleBlocked = async () => {
    if (!showBlocked && blockedUsers.length === 0 && blockedCount > 0) {
      setLoadingBlocked(true);
      const users = await fetch("/api/block/users").then((r) => r.json());
      setBlockedUsers(Array.isArray(users) ? users : []);
      setLoadingBlocked(false);
    }
    setShowBlocked((v) => !v);
  };

  const handleUnblock = async (targetId: string) => {
    const res = await fetch("/api/block", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetId, unblock: true }),
    });
    const data = await res.json();
    setBlockedCount(data.blockedUsers.length);
    setBlockedUsers((prev) => prev.filter((u) => u.id !== targetId));
    toast.success("User unblocked");
  };

  const user = session?.user as { name?: string | null; email?: string | null; image?: string | null };

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      <div className="card mb-4 flex items-center gap-4">
        <div className="relative w-14 h-14">
          {user?.image ? (
            <Image src={user.image} alt="Profile" fill className="rounded-full object-cover" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center text-2xl">😊</div>
          )}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{user?.name || "WorldPal"}</p>
          <p className="text-sm text-gray-400">{user?.email}</p>
        </div>
      </div>

      <div className="card mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-primary-500" /> Safety & Privacy
        </h3>

        <button
          onClick={toggleBlocked}
          className="w-full flex items-center justify-between py-3 border-b border-gray-50 hover:bg-gray-50 rounded-xl px-2 transition-colors"
        >
          <div className="flex items-center gap-3">
            <UserX className="w-5 h-5 text-gray-500" />
            <div className="text-left">
              <p className="font-medium text-gray-900 text-sm">Blocked users</p>
              <p className="text-xs text-gray-400">{blockedCount} blocked</p>
            </div>
          </div>
          <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${showBlocked ? "rotate-90" : ""}`} />
        </button>

        {showBlocked && (
          <div className="mt-3 space-y-2">
            {loadingBlocked ? (
              <div className="flex justify-center py-4"><LoadingSpinner size="sm" /></div>
            ) : blockedUsers.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-2">No blocked users</p>
            ) : (
              blockedUsers.map((u) => (
                <div key={u.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10">
                      {u.photoPath ? (
                        <Image src={u.photoPath} alt={u.displayName || "User"} fill className="rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg">😊</div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{u.displayName || "User"}</p>
                      <p className="text-xs text-gray-400">{COUNTRY_FLAGS[u.country || ""] || "🌍"} {u.country}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleUnblock(u.id)}
                    className="text-xs font-medium text-primary-600 hover:underline px-3 py-1 bg-primary-50 rounded-full"
                  >
                    Unblock
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="card mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-primary-500" /> About WorldPals
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          WorldPals is a platform for making genuine international friendships. We believe in
          cultural exchange, language learning, and respectful communication.
        </p>
        <div className="mt-4 space-y-2 text-sm text-gray-400">
          <p>Version 1.0.0</p>
          <p>Free to use — supported by advertising</p>
        </div>
      </div>

      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition-all font-medium"
      >
        <LogOut className="w-5 h-5" />
        Sign out
      </button>
    </div>
  );
}
