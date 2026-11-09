"use client";

import { useEffect, useRef } from "react";

/**
 * LoadWS:
 * Client registration component that registers /custom-sw.js with { updateViaCache: "none" }.
 */
export default function LoadWS() {
  const hasRegistered = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    // In development, unregister service workers and clear caches so Next.js HMR/Turbopack is not intercepted
    if (process.env.NODE_ENV === "development") {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
        }
      });
      if ("caches" in window) {
        caches.keys().then((names) => {
          names.forEach((name) => caches.delete(name));
        });
      }
      return;
    }

    if (hasRegistered.current) return;
    hasRegistered.current = true;

    navigator.serviceWorker
      .register("/custom-sw.js", { updateViaCache: "none" })
      .then((registration) => {
        console.log("[SW] Registered successfully with scope:", registration.scope);
        registration.update().catch(() => {});
      })
      .catch((error) => {
        console.warn("[SW] Registration error:", error);
      });
  }, []);

  return null;
}

