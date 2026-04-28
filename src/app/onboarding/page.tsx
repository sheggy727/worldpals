"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";
import { FullPageSpinner } from "@/components/ui/LoadingSpinner";

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") {
      const user = session.user as { isOnboarded?: boolean };
      if (user.isOnboarded) router.push("/discover");
    }
  }, [status, session, router]);

  if (status === "loading") return <FullPageSpinner />;

  return <OnboardingWizard />;
}
