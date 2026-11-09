import { create } from "zustand";
import { PAGES_CACHE_NAME, BASE_PAGES, SW_VERSION, ASSETS_CACHE_NAME } from "@/lib/pwa-constants";

export { SW_VERSION, PAGES_CACHE_NAME, ASSETS_CACHE_NAME, BASE_PAGES };

export interface CacheStatusState {
  pageStatuses: Record<string, boolean>;
  cachedPages: Record<string, boolean>;
  allCached: boolean;
  isAllCached: boolean;
  isInitialCheckDone: boolean;
  isChecking: boolean;
  isOffline: boolean;
  lastChecked: number | null;
  totalCachedCount: number;

  checkAllPages: (locale?: string) => Promise<void>;
  updatePageStatus: (url: string, isCached: boolean) => void;
  setOffline: (isOffline: boolean) => void;
  markPageCached: (path: string, cached: boolean) => void;
}

function normalizeRoutePath(path: string): string {
  if (!path) return "/";
  let p = path.replace(/^\/(ar|fr|en)/, "");
  if (!p.startsWith("/")) p = `/${p}`;
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  return p;
}

export const useCacheStatusStore = create<CacheStatusState>((set, get) => ({
  pageStatuses: {},
  cachedPages: {},
  allCached: false,
  isAllCached: false,
  isInitialCheckDone: false,
  isChecking: false,
  isOffline: false,
  lastChecked: null,
  totalCachedCount: 0,

  setOffline: (isOffline: boolean) => {
    set({ isOffline });
  },

  updatePageStatus: (url: string, isCached: boolean) => {
    const clean = normalizeRoutePath(url);
    const newStatuses = { ...get().pageStatuses, [clean]: isCached, [url]: isCached };
    const all = Object.values(newStatuses).every(Boolean) && Object.keys(newStatuses).length >= BASE_PAGES.length;
    set({
      pageStatuses: newStatuses,
      cachedPages: newStatuses,
      allCached: all,
      isAllCached: all,
    });
  },

  markPageCached: (path: string, cached: boolean) => {
    const cleanPath = normalizeRoutePath(path);
    const updated = { ...get().cachedPages, [cleanPath]: cached, [path]: cached };
    const all = BASE_PAGES.every((p) => updated[normalizeRoutePath(p)] === true);
    set({
      cachedPages: updated,
      pageStatuses: updated,
      isAllCached: all,
      allCached: all,
    });
  },

  checkAllPages: async (locale = "ar") => {
    if (typeof window === "undefined" || !("caches" in window)) {
      set({ isChecking: false, allCached: false, isAllCached: false, isInitialCheckDone: true });
      return;
    }

    set({ isChecking: true });

    try {
      const cacheKeys = await window.caches.keys();
      const targetCacheNames = cacheKeys.filter(
        (name) => name === PAGES_CACHE_NAME || name.startsWith("pages-")
      );

      if (targetCacheNames.length === 0) {
        set({ isChecking: false, allCached: false, isAllCached: false, isInitialCheckDone: true, totalCachedCount: 0 });
        return;
      }

      const storedUrls = new Set<string>();
      for (const cacheName of targetCacheNames) {
        try {
          const cache = await window.caches.open(cacheName);
          const requests = await cache.keys();
          for (const req of requests) {
            try {
              const u = new URL(req.url);
              storedUrls.add(u.pathname);
              const bare = u.pathname.replace(/^\/(ar|fr|en)/, "") || "/";
              storedUrls.add(bare);
            } catch {}
          }
        } catch {}
      }

      const results: Record<string, boolean> = {};
      let cachedCount = 0;

      for (const route of BASE_PAGES) {
        const cleanRoute = normalizeRoutePath(route);
        const localizedPath = `/${locale}${cleanRoute}`;

        const isPresent =
          storedUrls.has(cleanRoute) ||
          storedUrls.has(localizedPath) ||
          storedUrls.has(`/ar${cleanRoute}`) ||
          storedUrls.has(`/fr${cleanRoute}`) ||
          storedUrls.has(`/en${cleanRoute}`);

        results[cleanRoute] = isPresent;
        results[localizedPath] = isPresent;
        results[route] = isPresent;
        if (isPresent) {
          cachedCount += 1;
        }
      }

      const isWaterOnly = window.location.pathname.includes("/waterassociation");
      const isAll = isWaterOnly
        ? cachedCount >= 3 && results["/waterassociation/waterassociationmanager"] === true
        : cachedCount >= BASE_PAGES.length;

      set({
        pageStatuses: results,
        cachedPages: results,
        allCached: isAll,
        isAllCached: isAll,
        isInitialCheckDone: true,
        isChecking: false,
        lastChecked: Date.now(),
        totalCachedCount: cachedCount,
        isOffline: !navigator.onLine,
      });
    } catch (err) {
      console.warn("[useCacheStatusStore] checkAllPages error:", err);
      set({ isChecking: false, isInitialCheckDone: true });
    }
  },
}));
