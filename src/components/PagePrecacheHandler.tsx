"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import {
  BASE_PAGES,
  PAGES_CACHE_NAME,
  ASSETS_CACHE_NAME,
  useCacheStatusStore,
} from "@/stores/useCacheStatusStore";

const LOCALES = ["ar", "en", "fr"];
const THROTTLE_DELAY_MS = 100;

export function PagePrecacheHandler() {
  const pathname = usePathname();
  const locale = useLocale();
  const isPrecacheRunning = useRef(false);

  const checkAllPages = useCacheStatusStore((s) => s.checkAllPages);
  const setOffline = useCacheStatusStore((s) => s.setOffline);

  // ── Track visited pages in localStorage["visited-pages"] ──────────────────
  useEffect(() => {
    if (typeof window === "undefined" || !pathname) return;
    try {
      const key = "visited-pages";
      const raw = localStorage.getItem(key);
      const parsed = raw ? (JSON.parse(raw) as unknown) : [];
      const current = Array.isArray(parsed)
        ? (parsed.filter((p) => typeof p === "string") as string[])
        : [];

      const normalized = pathname.replace(/^\/(ar|fr|en)/, "") || "/";
      const next = [normalized, ...current.filter((p) => p !== normalized)].slice(0, 50);
      localStorage.setItem(key, JSON.stringify(next));
    } catch {}
  }, [pathname]);

  // ── Run proactive precaching engine when online ───────────────────────────
  useEffect(() => {
    if (typeof window === "undefined" || !("caches" in window)) return;
    if (process.env.NODE_ENV === "development") return;

    const runPrecaching = async () => {
      if (isPrecacheRunning.current) return;

      if (!navigator.onLine) {
        setOffline(true);
        await checkAllPages(locale);
        return;
      }
      setOffline(false);

      // Verify current cache count first
      await checkAllPages(locale);
      const currentStore = useCacheStatusStore.getState();
      if (currentStore.isAllCached) {
        return; // Already cached
      }

      isPrecacheRunning.current = true;
      console.log("[Precache] Starting proactive page & asset pre-caching...");

      try {
        const pagesCache = await window.caches.open(PAGES_CACHE_NAME);
        const assetsCache = await window.caches.open(ASSETS_CACHE_NAME);
        const origin = window.location.origin;

        let visited: string[] = [];
        try {
          const rawVisited = localStorage.getItem("visited-pages");
          visited = rawVisited ? JSON.parse(rawVisited) : [];
        } catch {}

        const uniqueRoutes = Array.from(new Set([...BASE_PAGES, ...visited]));
        let successCount = 0;
        const discoveredAssets = new Set<string>();

        // 1. Fetch each route across locales (ar first, then en, fr)
        for (const route of uniqueRoutes) {
          const cleanRoute = route.startsWith("/") ? route : `/${route}`;

          for (const loc of LOCALES) {
            if (!navigator.onLine) break;

            const localizedPath = `/${loc}${cleanRoute}`;
            const targetUrl = `${origin}${localizedPath}`;

            try {
              const res = await fetch(targetUrl, {
                credentials: "same-origin",
                headers: { "X-Precache-Worker": "1" },
              });

              if (res.ok) {
                const text = await res.clone().text();

                // Put in PAGES_CACHE under both localized URL, param URL, and bare path
                await pagesCache.put(new Request(targetUrl), res.clone());
                await pagesCache.put(
                  new Request(`${targetUrl}?__sw_locale=${loc}`),
                  res.clone()
                );
                await pagesCache.put(new Request(`${origin}${cleanRoute}`), res.clone());

                successCount += 1;

                // 2. HTML Asset Extraction: Extract script & link tags for /_next/static/
                extractNextStaticAssets(text).forEach((assetUrl) => {
                  discoveredAssets.add(assetUrl);
                });
              }
            } catch (err) {
              console.warn(`[Precache] Failed route: ${localizedPath}`, err);
            }

            await delay(THROTTLE_DELAY_MS);
          }
        }

        // 3. Proactively cache all extracted /_next/static/ assets so offline hydration never fails
        for (const assetPath of discoveredAssets) {
          if (!navigator.onLine) break;

          try {
            const assetUrl = assetPath.startsWith("http") ? assetPath : `${origin}${assetPath}`;
            const alreadyCached = await assetsCache.match(new Request(assetUrl));

            if (!alreadyCached) {
              const assetRes = await fetch(assetUrl);
              if (assetRes.ok) {
                await assetsCache.put(new Request(assetUrl), assetRes);
              }
            }
          } catch {}

          await delay(20);
        }

        // Save status in localStorage
        try {
          localStorage.setItem("last-precache-timestamp", Date.now().toString());
          localStorage.setItem("precache-success-count", successCount.toString());
        } catch {}

        console.log(`[Precache] Completed. Cached ${successCount} pages.`);
      } catch (err) {
        console.warn("[Precache] Pre-caching process error:", err);
      } finally {
        isPrecacheRunning.current = false;
        // Update real-time status store immediately
        await checkAllPages(locale);
      }
    };

    runPrecaching();

    const handleOnline = () => {
      setOffline(false);
      runPrecaching();
    };

    const handleOffline = () => {
      setOffline(true);
      checkAllPages(locale);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [checkAllPages, setOffline, locale]);

  return null;
}

function extractNextStaticAssets(html: string): string[] {
  const assets: string[] = [];

  const scriptRegex = /<script[^>]+src=["'](\/_next\/static\/[^"']+)["']/gi;
  let match: RegExpExecArray | null;
  while ((match = scriptRegex.exec(html)) !== null) {
    if (match[1]) assets.push(match[1]);
  }

  const linkRegex = /<link[^>]+href=["'](\/_next\/static\/[^"']+)["']/gi;
  while ((match = linkRegex.exec(html)) !== null) {
    if (match[1]) assets.push(match[1]);
  }

  return assets;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
