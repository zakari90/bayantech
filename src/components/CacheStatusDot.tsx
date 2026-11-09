"use client";

import React, { useState, useEffect } from "react";
import { useCacheStatusStore } from "@/stores/useCacheStatusStore";

interface CacheStatusDotProps {
  href: string;
  className?: string;
  showAlways?: boolean;
}

/**
 * CacheStatusDot:
 * Shows a green dot if the route is cached, an amber pulsing dot if uncached.
 * Automatically hides once all critical pages are verified cached.
 * Uses consistent placeholder to ensure 0 hydration mismatch.
 */
export function CacheStatusDot({ href, className = "", showAlways = false }: CacheStatusDotProps) {
  const [mounted, setMounted] = useState(false);
  const isAllCached = useCacheStatusStore((s) => s.isAllCached);
  const cachedPages = useCacheStatusStore((s) => s.cachedPages);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span className={`inline-flex shrink-0 w-2 h-2 ${className}`} />;
  }

  // Automatically hide once all critical pages are verified cached (unless showAlways is set)
  if (isAllCached && !showAlways) {
    return null;
  }

  // Normalize path without locale prefix
  let normalized = href.replace(/^\/(ar|fr|en)/, "") || "/";
  if (!normalized.startsWith("/")) normalized = `/${normalized}`;
  if (normalized.length > 1 && normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }

  const isCached = Boolean(cachedPages[normalized]);

  return (
    <span
      suppressHydrationWarning
      className={`inline-flex shrink-0 items-center justify-center ${className}`}
      title={isCached ? "الصفحة مخزنة محلياً ✓" : "جاري حفظ الصفحة..."}
    >
      {isCached ? (
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500/50" />
      ) : (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
        </span>
      )}
    </span>
  );
}
