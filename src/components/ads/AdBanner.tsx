"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdBannerProps {
  slot?: string;
  format?: "auto" | "rectangle" | "horizontal";
  className?: string;
}

export default function AdBanner({
  slot = "1234567890",
  format = "auto",
  className = "",
}: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

  useEffect(() => {
    if (!publisherId || pushed.current) return;
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
      pushed.current = true;
    } catch {
      // AdSense not loaded yet
    }
  }, [publisherId]);

  if (!publisherId || publisherId === "ca-pub-XXXXXXXXXXXXXXXX") {
    return (
      <div className={`bg-gray-100 border border-dashed border-gray-300 rounded-2xl flex items-center justify-center py-4 text-gray-400 text-xs ${className}`}>
        <div className="text-center">
          <p className="font-medium">Advertisement</p>
          <p className="opacity-60">Add your AdSense Publisher ID to show real ads</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-2xl ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle block"
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
        style={{ display: "block" }}
      />
    </div>
  );
}
