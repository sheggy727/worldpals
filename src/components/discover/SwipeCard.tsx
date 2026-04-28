"use client";

import { useRef } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import Image from "next/image";
import { MapPin, Flag } from "lucide-react";
import { UserProfile, COUNTRY_FLAGS } from "@/types";

interface SwipeCardProps {
  user: UserProfile;
  onSwipe: (direction: "like" | "pass") => void;
  isTop: boolean;
  index: number;
}

export default function SwipeCard({ user, onSwipe, isTop, index }: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-20, 20]);
  const friendOpacity = useTransform(x, [50, 150], [0, 1]);
  const passOpacity = useTransform(x, [-150, -50], [1, 0]);
  const cardOpacity = useTransform(x, [-300, 0, 300], [0.5, 1, 0.5]);
  const constraintsRef = useRef(null);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 100;
    const velocityThreshold = 400;

    if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      onSwipe("like");
    } else if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      onSwipe("pass");
    }
  };

  const flag = COUNTRY_FLAGS[user.country || ""] || "🌍";
  const stackOffset = (2 - index) * 4;
  const stackRotate = (index - 1) * 2;

  return (
    <motion.div
      ref={constraintsRef}
      className="absolute inset-0"
      style={{
        zIndex: 10 - index,
        top: stackOffset,
        rotate: stackRotate,
      }}
    >
      <motion.div
        drag={isTop ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.9}
        onDragEnd={handleDragEnd}
        style={{ x, rotate, opacity: isTop ? cardOpacity : 1 }}
        className="swipe-card absolute inset-0 bg-white rounded-4xl shadow-card overflow-hidden cursor-grab active:cursor-grabbing"
        whileTap={{ scale: isTop ? 1.02 : 1 }}
      >
        {/* Photo */}
        <div className="relative h-3/5">
          {user.photoPath ? (
            <Image
              src={user.photoPath}
              alt={user.displayName || "User"}
              fill
              className="object-cover"
              priority={isTop}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-300 flex items-center justify-center">
              <span className="text-8xl">😊</span>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* FRIEND overlay */}
          {isTop && (
            <motion.div
              style={{ opacity: friendOpacity }}
              className="absolute top-8 left-6 border-4 border-green-400 rounded-2xl px-4 py-2 rotate-[-15deg]"
            >
              <span className="text-green-400 text-2xl font-extrabold tracking-wider">FRIEND</span>
            </motion.div>
          )}

          {/* PASS overlay */}
          {isTop && (
            <motion.div
              style={{ opacity: passOpacity }}
              className="absolute top-8 right-6 border-4 border-red-400 rounded-2xl px-4 py-2 rotate-[15deg]"
            >
              <span className="text-red-400 text-2xl font-extrabold tracking-wider">PASS</span>
            </motion.div>
          )}
        </div>

        {/* Info */}
        <div className="h-2/5 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-gray-900">
                {user.displayName || "Anonymous"}{user.age ? `, ${user.age}` : ""}
              </h3>
              <span className="text-2xl">{flag}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
              <MapPin className="w-4 h-4" />
              <span>{user.country || "Unknown"}</span>
            </div>
            {user.bio && (
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{user.bio}</p>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {(user.languages || []).slice(0, 2).map((lang) => (
              <span key={lang} className="tag text-xs">
                <Flag className="w-3 h-3" />{lang}
              </span>
            ))}
            {(user.interests || []).slice(0, 2).map((interest) => (
              <span key={interest} className="tag text-xs">{interest}</span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
