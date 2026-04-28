"use client";

import { X, Heart } from "lucide-react";

interface ActionButtonsProps {
  onPass: () => void;
  onLike: () => void;
}

export default function ActionButtons({ onPass, onLike }: ActionButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-8">
      <button
        onClick={onPass}
        className="w-16 h-16 rounded-full bg-white border-2 border-gray-200 shadow-card flex items-center justify-center hover:border-red-300 hover:shadow-card-hover transition-all active:scale-90 group"
        aria-label="Pass"
      >
        <X className="w-7 h-7 text-gray-400 group-hover:text-red-400 transition-colors" />
      </button>
      <button
        onClick={onLike}
        className="w-20 h-20 rounded-full bg-primary-500 shadow-lg flex items-center justify-center hover:bg-primary-600 hover:shadow-xl transition-all active:scale-90"
        aria-label="Friend"
      >
        <Heart className="w-9 h-9 text-gray-900 fill-gray-900" />
      </button>
    </div>
  );
}
