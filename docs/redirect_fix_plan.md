# Plan: Fix Redirection Process

## Context

The app is an **offline-first PWA** with:
- Auth stored in **localStorage** (`last-auth-user`) — no session cookie is set on login (confirmed in [`actionsClient.ts:157`](file:///c:/Users/zakaria/Desktop/my%20projetc/bayantech/src/lib/actionsClient.ts#L157))
- JWT infrastructure exists in [`server-auth.ts`](file:///c:/Users/zakaria/Desktop/my%20projetc/bayantech/src/lib/server-auth.ts) but is unused for route protection
- All redirects are client-side via `useEffect` + `router.push` / `window.location.href`
- Service worker (Serwist) handles offline caching

---

## Task 1: Add `middleware.ts` for server-side route protection

**Files:** New `src/middleware.ts`

**What:** Create middleware that protects `/pro/admin/*` and `/pro/manager/*` routes when the user is online. Since the app doesn't set a session cookie on login, the middleware will be **lightweight** — it reads the `session` cookie (if present) and validates the JWT. If no cookie exists, the request passes through to the client-side guards (which handle both online and offline).

**Approach:**
- Read `session` cookie → decrypt JWT → check `role`
- If cookie exists but role doesn't match the route → redirect to correct dashboard
- If no cookie → let the request through (client-side guards handle it)
- Exclude API routes, static files, `_next`, public pages, and the `/free/*` routes
- Integrate with `next-intl` middleware (use `createMiddleware` from `next-intl`)

**Why not block requests without cookies?** Because offline users won't have a cookie — they auth via localStorage + Dexie. The middleware is an **extra security layer for online users**, not a replacement.

> [!IMPORTANT]
> This also requires **setting a session cookie on login**. We need to update [`actionsClient.ts`](file:///c:/Users/zakaria/Desktop/my%20projetc/bayantech/src/lib/actionsClient.ts) to set the `session` cookie after successful online login (using the existing `encrypt()` function). The cookie is only for server-side middleware; the client still uses localStorage.

**Files to modify:**
- New: `src/middleware.ts`
- Edit: [`src/lib/actionsClient.ts`](file:///c:/Users/zakaria/Desktop/my%20projetc/bayantech/src/lib/actionsClient.ts) — set session cookie on successful online login
- Edit: [`src/app/api/auth/logout/route.ts`](file:///c:/Users/zakaria/Desktop/my%20projetc/bayantech/src/app/api/auth/logout) — clear session cookie on logout

---

## Task 2: Fix logout locale bug

**File:** [`src/context/authContext.tsx`](file:///c:/Users/zakaria/Desktop/my%20projetc/bayantech/src/context/authContext.tsx)

**What:** `logout()` currently does `window.location.href = "/"`, which always redirects to `/ar` (hardcoded in root `page.tsx`). Fix it to redirect to `/${locale}/pro/login` to preserve the user's language.

**Change:**
```diff
- window.location.href = "/";
+ window.location.href = `/${document.documentElement.lang || "ar"}/pro/login`;
```

> [!NOTE]
> We use `document.documentElement.lang` because `logout` is a `useCallback` and we can't use hooks inside it. The `lang` attribute is set by `next-intl` on the `<html>` element.

---

## Task 3: Fix auth layout login form flash

**File:** [`src/app/[locale]/pro/(auth)/layout.tsx`](file:///c:/Users/zakaria/Desktop/my%20projetc/bayantech/src/app/%5Blocale%5D/pro/%28auth%29/layout.tsx)

**What:** When an already-authenticated user lands on the login page, the redirect fires in `useEffect` but the login form renders in the meantime (visible flash). Fix by returning `null` when the user is authenticated and redirect is pending.

**Change:**
```diff
  // Show loading state while checking authentication
- if (!mounted || isLoading) {
+ if (!mounted || isLoading || user) {
```

This way, if the user is already logged in, we show the loading spinner instead of the login form while the redirect is executing.

---

## Task 4: Standardize redirect methods (pro routes only)

**Files:**
- [`src/components/login-form.tsx`](file:///c:/Users/zakaria/Desktop/my%20projetc/bayantech/src/components/login-form.tsx)

**What:** Replace `window.location.href = destination` with `router.push(destination)` for post-login redirect. The comment says `window.location.href` is needed for offline but `router.push` works fine with service workers.

**Change:**
```diff
- // Use window.location.href for reliable redirect in both online and offline modes
- window.location.href = destination;
+ router.push(destination);
```

> [!WARNING]
> We do NOT standardize `window.location.href` in `logout()` or `masterDelete` — those intentionally do a **full page reload** to clear all in-memory state, which is correct behavior for destructive operations.

---

## Task 5: Fix root page hardcoded `/ar` redirect

**File:** [`src/app/page.tsx`](file:///c:/Users/zakaria/Desktop/my%20projetc/bayantech/src/app/page.tsx)

**What:** Currently hardcodes `redirect("/ar")`. Should detect locale from `Accept-Language` header or default to `ar`.

**Change:** Use `next-intl`'s routing to pick the correct locale, or read the `NEXT_LOCALE` cookie:
```diff
+ import { cookies, headers } from "next/headers";
  
  export default function RootPage() {
-   redirect("/ar");
+   const cookieStore = cookies();
+   const locale = cookieStore.get("NEXT_LOCALE")?.value || "ar";
+   redirect(`/${locale}`);
  }
```

---

## Task 6: Clean up `masterDelete` setTimeout race condition

**File:** [`src/components/masterDelete.tsx`](file:///c:/Users/zakaria/Desktop/my%20projetc/bayantech/src/components/masterDelete.tsx)

**What:** The 1-second `setTimeout` before redirect can fire on an unmounted component. Wrap in a ref-based cleanup.

**Change:** Track mounted state and skip redirect if component unmounted:
```diff
+ const mountedRef = useRef(true);
+ useEffect(() => () => { mountedRef.current = false; }, []);

  setTimeout(async () => {
    // ... cleanup logic ...
+   if (!mountedRef.current) return;
    window.location.href = `/${locale}/pro/login`;
  }, 1000);
```

---

## Execution Order

| Order | Task | Risk | Scope |
|-------|------|------|-------|
| 1 | Task 3 — Auth layout flash fix | 🟢 Low | 1 line change |
| 2 | Task 2 — Logout locale fix | 🟢 Low | 1 line change |
| 3 | Task 5 — Root page locale fix | 🟢 Low | Small change |
| 4 | Task 6 — masterDelete cleanup | 🟢 Low | Small change |
| 5 | Task 4 — Standardize redirects | 🟡 Med | Need to verify offline PWA still works |
| 6 | Task 1 — Add middleware.ts | 🟡 Med | New file + cookie integration; needs testing |

> [!TIP]
> Tasks 1-4 can be done in sequence quickly. Task 5 and 6 need more careful testing with the PWA/offline flow.
