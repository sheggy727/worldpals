"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Compass, Heart, User, Settings } from "lucide-react";
import { FullPageSpinner } from "@/components/ui/LoadingSpinner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") {
      const user = session.user as { isOnboarded?: boolean };
      if (!user.isOnboarded) router.push("/onboarding");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <FullPageSpinner />;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <main className="flex-1 pb-20">{children}</main>
      <BottomNav />
    </div>
  );
}

function BottomNav() {
  const pathname = usePathname();

  const links = [
    { href: "/discover", icon: Compass, label: "Discover" },
    { href: "/matches", icon: Heart, label: "Matches" },
    { href: "/profile", icon: User, label: "Profile" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40">
      <div className="max-w-lg mx-auto px-4 py-2 flex justify-around">
        {links.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-2xl transition-all ${
                active
                  ? "text-gray-900 bg-primary-50"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Icon className={`w-6 h-6 ${active ? "fill-primary-500 text-gray-900" : ""}`} />
              <span className={`text-xs font-medium ${active ? "text-gray-900" : ""}`}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
