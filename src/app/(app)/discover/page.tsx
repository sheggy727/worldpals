import SwipeDeck from "@/components/discover/SwipeDeck";
import { Globe } from "lucide-react";

export default function DiscoverPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-6 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-500 rounded-xl flex items-center justify-center">
            <Globe className="w-5 h-5 text-gray-900" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">WorldPals</h1>
        </div>
        <span className="text-sm text-gray-400 font-medium">Discover</span>
      </div>

      <SwipeDeck />
    </div>
  );
}
