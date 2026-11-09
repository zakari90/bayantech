"use client";

import React, { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import {
  getSettings,
  isSecurityPinEnabled,
  isUserAuthenticated,
} from "@/app/waterdexiedb";

export function WaterAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const s = await getSettings();

        // 1. If first visit and onboarding is not completed, redirect to setup wizard
        if (!s.onboardingCompleted) {
          setIsAuthorized(false);
          router.replace(`/${locale}/waterassociation?setup=true`);
          return;
        }

        // 2. If PIN lock is enabled, check session authentication
        if (s.pinEnabled && !isUserAuthenticated()) {
          setIsAuthorized(false);
          router.replace(`/${locale}/waterassociation/login`);
          return;
        }

        setIsAuthorized(true);
      } catch (err) {
        console.error("Auth guard error:", err);
        // Fallback to allow access if error reading DB
        setIsAuthorized(true);
      }
    }
    checkAuth();
  }, [locale, router, pathname]);

  if (isAuthorized === null) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-3 border-cyan-500/30 border-t-cyan-500 animate-spin" />
        <span className="text-xs text-muted-foreground">...</span>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
