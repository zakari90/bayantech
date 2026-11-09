/// <reference lib="webworker" />

// ==============================================================================
// Bayyane Water Association Management - Service Worker Source
// Version: v1.0.0
// ==============================================================================

const sw: any = self as any;

const SW_VERSION = "v1.0.1";
const PAGES_CACHE = `pages-${SW_VERSION}`;
const ASSETS_CACHE = `assets-${SW_VERSION}`;
const OFFLINE_URL = "/offline.html";

const NAVIGATION_TIMEOUT_MS = 6000;

sw.addEventListener("install", (event: any) => {
  sw.skipWaiting();
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(PAGES_CACHE);
        await cache.add(new Request(OFFLINE_URL, { cache: "reload" }));
      } catch (err) {}
    })()
  );
});

sw.addEventListener("activate", (event: any) => {
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
            .map((name) => caches.delete(name))
        );
        await sw.clients.claim();
      } catch (e) {}
    })()
  );
});

sw.addEventListener("message", (event: any) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    sw.skipWaiting();
  }
});

function getPrimaryAcceptLanguage(header: string | null): string {
  if (!header) return "ar";
  const first = header.split(",")[0]?.trim();
  if (!first) return "ar";
  return first.split(";")[0]?.trim().split("-")[0] || "ar";
}

function resolveLocale(request: Request, url: URL): string {
  const paramLocale = url.searchParams.get("__sw_locale");
  if (paramLocale) return paramLocale;

  if (url.pathname.startsWith("/ar/") || url.pathname === "/ar") return "ar";
  if (url.pathname.startsWith("/fr/") || url.pathname === "/fr") return "fr";
  if (url.pathname.startsWith("/en/") || url.pathname === "/en") return "en";

  try {
    const acceptLang = request.headers.get("accept-language");
    return getPrimaryAcceptLanguage(acceptLang);
  } catch {
    return "ar";
  }
}

function fetchWithTimeout(request: Request, ms: number): Promise<Response> {
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

async function matchAnyLocalePage(cache: Cache, origin: string, pathname: string): Promise<Response | null> {
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

async function matchAppShell(cache: Cache, origin: string, locale: string): Promise<Response | null> {
  const localizedRoot = await cache.match(new Request(`${origin}/${locale}`));
  if (localizedRoot) return localizedRoot;

  const plainRoot = await cache.match(new Request(`${origin}/`));
  if (plainRoot) return plainRoot;

  const arRoot = await cache.match(new Request(`${origin}/ar`));
  if (arRoot) return arRoot;

  const managerShell = await cache.match(new Request(`${origin}/ar/waterassociation/waterassociationmanager`));
  if (managerShell) return managerShell;

  return null;
}

sw.addEventListener("fetch", (event: any) => {
  const request = event.request;
  if (!request || request.method !== "GET") return;

  const url = new URL(request.url);

  if (!url.protocol.startsWith("http")) return;
  if (url.origin !== sw.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  // 1. Static Assets Caching (Stale-While-Revalidate)
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(ASSETS_CACHE);
        const cacheKey = new Request(url.href, { method: "GET" });
        const cached = await cache.match(cacheKey);

        if (cached) {
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

  // 2. Page Navigation Requests (Network-First with 3s Timeout)
  const isNavigate = request.mode === "navigate";
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

        const resolveCascade = async () => {
          if (isRsc) {
            const rscCached = await cache.match(exactKey);
            if (rscCached) return rscCached;
            return new Response("Offline", { status: 503, headers: { "Content-Type": "text/plain" } });
          }

          const isHtml = (res: Response | null | undefined) => {
            if (!res) return false;
            const ct = res.headers.get("content-type") || "";
            return ct.includes("text/html");
          };

          const exactLocalized = await cache.match(localizedKey);
          if (exactLocalized && isHtml(exactLocalized)) return exactLocalized;

          const anyLocaleVariant = await matchAnyLocalePage(cache, url.origin, url.pathname);
          if (anyLocaleVariant && isHtml(anyLocaleVariant)) return anyLocaleVariant;

          const plainPath = await cache.match(plainKey);
          if (plainPath && isHtml(plainPath)) return plainPath;

          const shell = await matchAppShell(cache, url.origin, locale);
          if (shell && isHtml(shell)) return shell;

          const offlineHtml = await cache.match(new Request(`${url.origin}${OFFLINE_URL}`));
          if (offlineHtml) return offlineHtml;

          const relativeOffline = await cache.match(OFFLINE_URL);
          if (relativeOffline) return relativeOffline;

          return new Response("Offline", { status: 503, headers: { "Content-Type": "text/plain" } });
        };

        if (!navigator.onLine) {
          return await resolveCascade();
        }

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
          return await resolveCascade();
        } catch {
          return await resolveCascade();
        }
      })()
    );
    return;
  }
});
