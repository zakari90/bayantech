/* eslint-disable no-restricted-globals */

// ==============================================================================
// Bayyane Water Association Management - Offline-First Service Worker
// Version: v1.0.0
// ==============================================================================

const SW_VERSION = "v1.0.1";
const PAGES_CACHE = `pages-${SW_VERSION}`;
const ASSETS_CACHE = `assets-${SW_VERSION}`;
const OFFLINE_URL = "/offline.html";

const NAVIGATION_TIMEOUT_MS = 6000;

const sw = self;

// ── Install Event ─────────────────────────────────────────────────────────────
// Pre-cache OFFLINE_URL into PAGES_CACHE and activate immediately
sw.addEventListener("install", (event) => {
  console.log(`[SW] Install ${SW_VERSION}`);
  sw.skipWaiting();

  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(PAGES_CACHE);
        await cache.add(new Request(OFFLINE_URL, { cache: "reload" }));
        console.log(`[SW] Precached ${OFFLINE_URL}`);
      } catch (err) {
        console.warn(`[SW] Failed to precache ${OFFLINE_URL}:`, err);
      }
    })()
  );
});

// ── Activate Event ────────────────────────────────────────────────────────────
// Clean up outdated pages-* and assets-* caches not matching SW_VERSION
sw.addEventListener("activate", (event) => {
  console.log(`[SW] Activate ${SW_VERSION}`);
  event.waitUntil(
    (async () => {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames
            .filter((name) => {
              return (
                (name.startsWith("pages-") || name.startsWith("assets-")) &&
                name !== PAGES_CACHE &&
                name !== ASSETS_CACHE
              );
            })
            .map((name) => {
              console.log(`[SW] Deleting old cache: ${name}`);
              return caches.delete(name);
            })
        );
        await sw.clients.claim();
        console.log(`[SW] Clients claimed, active cache: ${SW_VERSION}`);
      } catch (err) {
        console.error(`[SW] Activation error:`, err);
      }
    })()
  );
});

// ── Message Listener ──────────────────────────────────────────────────────────
// Support SKIP_WAITING from client update triggers
sw.addEventListener("message", (event) => {
  if (event && event.data && event.data.type === "SKIP_WAITING") {
    console.log(`[SW] Received SKIP_WAITING signal`);
    sw.skipWaiting();
  }
});

// ── Helpers ───────────────────────────────────────────────────────────────────
function getPrimaryAcceptLanguage(header) {
  if (!header) return "ar";
  const first = header.split(",")[0]?.trim();
  if (!first) return "ar";
  return first.split(";")[0]?.trim().split("-")[0] || "ar";
}

function resolveLocale(request, url) {
  // 1. From URL search params
  const paramLocale = url.searchParams.get("__sw_locale");
  if (paramLocale) return paramLocale;

  // 2. From URL path segment
  if (url.pathname.startsWith("/ar/") || url.pathname === "/ar") return "ar";
  if (url.pathname.startsWith("/fr/") || url.pathname === "/fr") return "fr";
  if (url.pathname.startsWith("/en/") || url.pathname === "/en") return "en";

  // 3. From Accept-Language header
  try {
    const acceptLang = request.headers.get("accept-language");
    return getPrimaryAcceptLanguage(acceptLang);
  } catch {
    return "ar";
  }
}

function fetchWithTimeout(request, ms) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ms);
  return fetch(request, { signal: controller.signal }).then(
    (res) => {
      clearTimeout(timeoutId);
      return res;
    },
    (err) => {
      clearTimeout(timeoutId);
      throw err;
    }
  );
}

async function matchAnyLocalePage(cache, origin, pathname) {
  try {
    const keys = await cache.keys();
    const barePath = pathname.replace(/^\/(ar|fr|en)/, "");
    for (const req of keys) {
      const reqUrl = new URL(req.url);
      const reqBarePath = reqUrl.pathname.replace(/^\/(ar|fr|en)/, "");
      if (reqBarePath === barePath) {
        const res = await cache.match(req);
        if (res) return res;
      }
    }
  } catch {}
  return null;
}

async function matchAppShell(cache, origin, locale) {
  // 1. Localized root shell
  const localizedRoot = await cache.match(new Request(`${origin}/${locale}`));
  if (localizedRoot) return localizedRoot;

  // 2. Plain root shell
  const plainRoot = await cache.match(new Request(`${origin}/`));
  if (plainRoot) return plainRoot;

  // 3. Localized default Arabic shell
  const arRoot = await cache.match(new Request(`${origin}/ar`));
  if (arRoot) return arRoot;

  // 4. Water association dashboard shell
  const managerShell = await cache.match(new Request(`${origin}/ar/waterassociation/waterassociationmanager`));
  if (managerShell) return managerShell;

  return null;
}

// ── Fetch Event ───────────────────────────────────────────────────────────────
sw.addEventListener("fetch", (event) => {
  const request = event.request;
  if (!request || request.method !== "GET") return;

  const url = new URL(request.url);

  // Ignore cross-origin, extensions, and non-http protocols
  if (!url.protocol.startsWith("http")) return;
  if (url.origin !== sw.location.origin) return;

  // Never cache /api/* endpoints
  if (url.pathname.startsWith("/api/")) return;

  // ── 1. Static Assets Caching (Stale-While-Revalidate) ────────────────────────
  // For /_next/static/ requests
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(ASSETS_CACHE);
        const cacheKey = new Request(url.href, { method: "GET" });
        const cached = await cache.match(cacheKey);

        if (cached) {
          // Serve from cache while revalidating from network in background
          event.waitUntil(
            fetch(request)
              .then(async (networkRes) => {
                if (networkRes && networkRes.ok) {
                  await cache.put(cacheKey, networkRes.clone());
                }
              })
              .catch(() => {})
          );
          return cached;
        }

        // Uncached: fetch from network and store in ASSETS_CACHE
        try {
          const networkRes = await fetch(request);
          if (networkRes && networkRes.ok) {
            await cache.put(cacheKey, networkRes.clone());
          }
          return networkRes;
        } catch {
          return new Response("", { status: 504, statusText: "Offline Asset Missing" });
        }
      })()
    );
    return;
  }

  // ── 2. Page Navigation Requests (Network-First with 3s Timeout) ──────────────
  const isNavigate = request.mode === "navigate";
  // Also support Next.js App Router RSC requests so client-side router works offline
  const isRsc = url.searchParams.has("_rsc") || request.headers.get("RSC") === "1";

  if (isNavigate || isRsc) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(PAGES_CACHE);
        const locale = resolveLocale(request, url);

        const localizedKey = new Request(
          `${url.origin}${url.pathname}?__sw_locale=${encodeURIComponent(locale)}`,
          { method: "GET" }
        );
        const plainKey = new Request(`${url.origin}${url.pathname}`, { method: "GET" });
        const exactKey = new Request(url.href, { method: "GET" });

        // If currently offline, skip network timeout and check cache immediately
        if (!navigator.onLine) {
          return await resolveOfflineFallbackCascade(cache, url, locale, localizedKey, plainKey, exactKey, isRsc);
        }

        // Online: Race network against timeout
        try {
          const networkRes = await fetchWithTimeout(request, NAVIGATION_TIMEOUT_MS);
          if (networkRes && networkRes.ok) {
            const contentType = networkRes.headers.get("content-type") || "";
            if (isNavigate && contentType.includes("text/html")) {
              await cache.put(localizedKey, networkRes.clone());
              await cache.put(plainKey, networkRes.clone());
            } else if (isRsc) {
              await cache.put(exactKey, networkRes.clone());
            }
            return networkRes;
          }

          // Non-OK response (e.g. server error) -> fall back to cache
          return await resolveOfflineFallbackCascade(cache, url, locale, localizedKey, plainKey, exactKey, isRsc);
        } catch (err) {
          // Network failed or timed out -> Fall back gracefully through cascade
          console.log(`[SW] Network failed/timed out for ${url.pathname}, triggering fallback cascade.`);
          return await resolveOfflineFallbackCascade(cache, url, locale, localizedKey, plainKey, exactKey, isRsc);
        }
      })()
    );
    return;
  }
});

// Cascade fallback resolution:
// 1. Exact localized page in PAGES_CACHE
// 2. Any cached language variant of the same pathname
// 3. Plain pathname in PAGES_CACHE
// 4. App shell (/ or localized root)
// 5. Precached /offline.html
// 6. 503 Offline response if nothing is available
async function resolveOfflineFallbackCascade(cache, url, locale, localizedKey, plainKey, exactKey, isRsc) {
  // If RSC request, only return matching RSC cache or 503 so Next.js client router falls back to hard document navigation
  if (isRsc) {
    const rscCached = await cache.match(exactKey);
    if (rscCached) return rscCached;
    return new Response("Offline", { status: 503, headers: { "Content-Type": "text/plain" } });
  }

  // Document navigations: ensure cached response is genuine HTML (never return raw RSC)
  const isHtml = (res) => {
    if (!res) return false;
    const ct = res.headers.get("content-type") || "";
    return ct.includes("text/html");
  };

  // 1. Exact localized page in PAGES_CACHE
  const exactLocalized = await cache.match(localizedKey);
  if (exactLocalized && isHtml(exactLocalized)) return exactLocalized;

  // 2. Any cached language variant of the same pathname
  const anyLocaleVariant = await matchAnyLocalePage(cache, url.origin, url.pathname);
  if (anyLocaleVariant && isHtml(anyLocaleVariant)) return anyLocaleVariant;

  // 3. Plain pathname in PAGES_CACHE
  const plainPath = await cache.match(plainKey);
  if (plainPath && isHtml(plainPath)) return plainPath;

  // 4. App shell (/ or localized root)
  const shell = await matchAppShell(cache, url.origin, locale);
  if (shell && isHtml(shell)) return shell;

  // 5. Precached /offline.html
  const offlineHtml = await cache.match(new Request(`${url.origin}${OFFLINE_URL}`));
  if (offlineHtml) return offlineHtml;

  // Also check plain relative offline URL
  const relativeOffline = await cache.match(OFFLINE_URL);
  if (relativeOffline) return relativeOffline;

  // 6. 503 Offline response if nothing is available
  return new Response("Offline - Service Unavailable", {
    status: 503,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
