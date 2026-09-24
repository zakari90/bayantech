// src/app/[locale]/(auth)/login/page.tsx
import { LoginForm } from "@/components/login-form";
import OfflineNotificationBanner from "@/components/offline-notification-banner";
import db from "@/lib/db";

// Disable static generation for this page since it uses client-side auth
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  let adminData = null;
  let dbError = null;
  try {
    adminData = await db.user.findFirst({
      where: { role: "ADMIN" }
    });
  } catch(e: any) {
    console.error("DB Fetch Error:", e);
    dbError = e.message || String(e);
  }

  return (
    <div className="flex flex-col min-h-svh w-full items-center justify-center p-1 md:p-4 gap-4">
      <OfflineNotificationBanner />

      <div className="w-full lg:max-w-sm">
        <LoginForm />
      </div>

      <div className="w-full lg:max-w-sm p-4 border border-blue-200 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-md text-sm mt-4">
        <p className="font-semibold mb-2">Test Admin Credentials:</p>
        {adminData ? (
          <>
            <p><strong>Email:</strong> {adminData.email}</p>
            <p className="text-xs mt-2 opacity-80">
              (Password is encrypted in DB. Default is usually "123456")
            </p>
          </>
        ) : dbError ? (
          <p className="text-red-500">Error fetching: {dbError}</p>
        ) : (
          <p className="text-amber-600">No ADMIN user found in database.</p>
        )}
      </div>
    </div>
  );
}
