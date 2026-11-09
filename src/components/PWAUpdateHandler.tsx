"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import { RefreshCw, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * PWAUpdateHandler:
 * Detects waiting service workers and lets the user click "Update" to trigger SKIP_WAITING and reload.
 */
export function PWAUpdateHandler() {
  const locale = useLocale();
  const isRtl = locale === "ar";

  const [hasUpdate, setHasUpdate] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const waitingWorkerRef = useRef<ServiceWorker | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    let refreshing = false;

    // Reload page when new service worker takes control
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });

    navigator.serviceWorker.ready.then((registration) => {
      // 1. If there is already a waiting worker
      if (registration.waiting) {
        waitingWorkerRef.current = registration.waiting;
        setHasUpdate(true);
      }

      // 2. Listen for newly discovered updates
      registration.addEventListener("updatefound", () => {
        const installingWorker = registration.installing;
        if (!installingWorker) return;

        installingWorker.addEventListener("statechange", () => {
          if (
            installingWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            waitingWorkerRef.current = installingWorker;
            setHasUpdate(true);
          }
        });
      });
    });
  }, []);

  const handleUpdate = () => {
    if (waitingWorkerRef.current) {
      setIsUpdating(true);
      waitingWorkerRef.current.postMessage({ type: "SKIP_WAITING" });

      // Fallback reload if controllerchange doesn't fire within 1s
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      window.location.reload();
    }
  };

  if (!hasUpdate) return null;

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="fixed top-4 start-1/2 -translate-x-1/2 z-50 max-w-md w-[92vw] sm:w-auto animate-in fade-in slide-in-from-top-4 duration-300"
    >
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border bg-card/95 backdrop-blur-xl shadow-2xl border-cyan-500/40 text-card-foreground">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-cyan-500 to-blue-600 text-white shadow-sm shadow-blue-500/30">
          <Sparkles className="h-4 w-4" />
        </div>

        <div className="flex-1 min-w-0 pe-2">
          <h4 className="text-xs font-bold leading-tight text-foreground">
            {isRtl ? "تحديث جديد متوفر" : locale === "fr" ? "Nouvelle version disponible" : "New update available"}
          </h4>
          <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
            {isRtl
              ? "انقر للتحديث وتفعيل أحدث تحسينات التخزين"
              : locale === "fr"
              ? "Cliquez pour actualiser l'application"
              : "Click to reload with the latest updates"}
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            size="sm"
            onClick={handleUpdate}
            disabled={isUpdating}
            className="h-8 px-3 rounded-xl bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-xs"
          >
            <RefreshCw className={`h-3 w-3 me-1.5 ${isUpdating ? "animate-spin" : ""}`} />
            <span>{isUpdating ? (isRtl ? "جارٍ التحديث..." : "Updating...") : (isRtl ? "تحديث الآن" : "Update Now")}</span>
          </Button>

          <button
            onClick={() => setHasUpdate(false)}
            className="text-muted-foreground hover:text-foreground p-1 rounded-lg transition-colors"
            title={isRtl ? "إغلاق" : "Dismiss"}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

