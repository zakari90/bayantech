export const SW_VERSION = "v1.2.0";
export const PAGES_CACHE_NAME = `pages-${SW_VERSION}`;
export const ASSETS_CACHE_NAME = `assets-${SW_VERSION}`;

/** Single source of truth for all pages to precache / track in free mode */
export const BASE_PAGES = [
  "/free",
  "/free/schedule",
  "/free/login",
  "/free/admin",
  "/free/admin/center",
  "/free/admin/receipts",
  "/free/admin/schedule",
  "/free/admin/users",
  "/free/admin/database",
] as const;

