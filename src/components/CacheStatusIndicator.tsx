"use client";

import React, { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { WifiOff, CheckCircle2, RefreshCw } from "lucide-react";
import { useCacheStatusStore } from "@/stores/useCacheStatusStore";

interface CacheStatusIndicatorProps {
  className?: string;
  variant?: "default" | "compact";
}

/**
 * CacheStatusIndicator:
 * Dynamic header badge displaying offline/caching state.
 * Color States:
 * - Amber: Offline (بدون أنترنت)
 * - Emerald Green: Cached & Offline Ready (جاهز للعمل بدون إنترنت)
 * - Blue: Caching / Checking (جاري الحفظ...)
 */
export function CacheStatusIndicator({
  className = "",
  variant = "default",
}: CacheStatusIndicatorProps) {
  const [mounted, setMounted] = useState(false);
  const [offlineState, setOfflineState] = useState(false);

  const locale = useLocale();
  const isRtl = locale === "ar";
  const pathname = usePathname();

  const isAllCached = useCacheStatusStore((s) => s.isAllCached);
  const isChecking = useCacheStatusStore((s) => s.isChecking);
  const totalCachedCount = useCacheStatusStore((s) => s.totalCachedCount);
  const checkAllPages = useCacheStatusStore((s) => s.checkAllPages);

  // Initialize and check status on mount and on route change
  useEffect(() => {
    setMounted(true);
    setOfflineState(!navigator.onLine);

    checkAllPages(locale);

    const handleOnline = () => {
      setOfflineState(false);
      checkAllPages(locale);
    };

    const handleOffline = () => {
      setOfflineState(true);
      checkAllPages(locale);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [checkAllPages, locale, pathname]);

  // Label dictionary
  const labels = {
    offline: isRtl ? "بدون أنترنت" : locale === "fr" ? "Hors-ligne" : "Offline",
    ready: isRtl
      ? "جاهز للعمل بدون إنترنت"
      : locale === "fr"
      ? "Prêt hors-ligne"
      : "Ready for offline",
    cachedPartial: isRtl
      ? "مخزن محلياً"
      : locale === "fr"
      ? "Enregistré localement"
      : "Cached offline",
    caching: isRtl
      ? "جاري الحفظ..."
      : locale === "fr"
      ? "Mise en cache..."
      : "Caching...",
  };

  // SSR & initial client render placeholder:
  // Render exact identical <div> container to preserve DOM tree structure and child positions
  if (!mounted) {
    return (
      <div
        suppressHydrationWarning
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border/40 bg-muted/20 text-muted-foreground text-[11px] font-medium shadow-xs select-none ${className}`}
      >
        <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
        {variant !== "compact" && (
          <span className="opacity-0">{labels.ready}</span>
        )}
      </div>
    );
  }

  // 1. Offline Mode -> Amber Badge
  if (offlineState) {
    return (
      <div
        suppressHydrationWarning
        onClick={() => checkAllPages(locale)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[11px] font-bold shadow-xs select-none cursor-pointer hover:bg-amber-500/20 transition-colors ${className}`}
        title={labels.offline}
      >
        <WifiOff className="h-3 w-3 shrink-0 text-amber-500" />
        {variant !== "compact" && <span>{labels.offline}</span>}
      </div>
    );
  }

  // 2. All or Core Pages Cached -> Emerald Green Badge
  if (isAllCached || totalCachedCount >= 3) {
    return (
      <div
        suppressHydrationWarning
        onClick={() => checkAllPages(locale)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold shadow-xs select-none cursor-pointer hover:bg-emerald-500/20 transition-colors ${className}`}
        title={isAllCached ? labels.ready : `${labels.cachedPartial} (${totalCachedCount})`}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-500" />
        {variant !== "compact" && (
          <span>{isAllCached ? labels.ready : labels.cachedPartial}</span>
        )}
      </div>
    );
  }

  // 3. Caching in Progress -> Blue Badge with Spinner
  return (
    <div
      suppressHydrationWarning
      onClick={() => checkAllPages(locale)}
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400 text-[10px] font-medium shadow-xs select-none cursor-pointer hover:bg-blue-500/20 transition-colors ${className}`}
      title={labels.caching}
    >
      <RefreshCw
        className={`h-2.5 w-2.5 shrink-0 text-blue-500 ${isChecking ? "animate-spin" : ""}`}
      />
      {variant !== "compact" && <span>{labels.caching}</span>}
    </div>
  );
}
