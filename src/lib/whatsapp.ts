/**
 * src/lib/whatsapp.ts
 * Utility to send WhatsApp messages using Meta WhatsApp Business Cloud API (v20.0).
 *
 * Architectural invariants:
 *  - All functions return a result object; they never throw.
 *  - Credentials are read from server-side env vars only (no NEXT_PUBLIC_ prefix).
 *  - Requests timeout after 5 seconds to avoid blocking the caller.
 */

export interface WhatsAppResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface RegistrationNotificationParams {
  /** Recipient WhatsApp number. Falls back to ADMIN_WHATSAPP_NUMBER env var if omitted. */
  adminPhone?: string | null;
  type: "student" | "teacher";
  name: string;
  phone: string;
  grade?: string | null;
  parentName?: string | null;
  parentPhone?: string | null;
  centerName?: string;
}

// ---------------------------------------------------------------------------
// Phone normalization
// ---------------------------------------------------------------------------

/**
 * Strips non-digit characters and converts a leading `0` to a Moroccan country
 * code prefix so the result is E.164-compatible (no '+' or spaces).
 *
 * Examples:
 *   "0612345678"   → "212612345678"
 *   "+212 6-12345" → "212612345"
 *   "212612345678" → "212612345678"
 */
export function sanitizePhoneNumber(
  phone: string,
  defaultCountryCode = "212",
): string {
  let cleaned = phone.replace(/[^\d]/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = defaultCountryCode + cleaned.substring(1);
  }
  return cleaned;
}

function isValidPhoneNumber(phone: string): boolean {
  // After sanitization, a valid international number has at least 10 digits.
  return /^\d{10,15}$/.test(phone);
}

// ---------------------------------------------------------------------------
// Core send function
// ---------------------------------------------------------------------------

/**
 * Sends a freeform WhatsApp text message via Meta Cloud API.
 * Always resolves (never rejects) — caller must check `result.success`.
 */
export async function sendWhatsAppMessage(options: {
  to: string;
  message: string;
}): Promise<WhatsAppResult> {
  const token = process.env.WHATSAPP_API_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  // Graceful degradation: log and skip when credentials are absent.
  if (!token || !phoneNumberId) {
    console.warn(
      "[WHATSAPP] WHATSAPP_API_TOKEN or WHATSAPP_PHONE_NUMBER_ID is not set. " +
        "Skipping WhatsApp notification.",
    );
    return { success: false, error: "Missing WhatsApp credentials" };
  }

  const recipient = sanitizePhoneNumber(options.to);
  if (!isValidPhoneNumber(recipient)) {
    console.warn(`[WHATSAPP] Invalid recipient phone number: "${options.to}". Skipping.`);
    return { success: false, error: "Invalid recipient phone number" };
  }

  const endpoint = `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`;

  // Enforce a 5-second timeout so this never blocks the caller.
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: recipient,
        type: "text",
        text: {
          preview_url: false,
          body: options.message,
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const data = await res.json();

    if (!res.ok) {
      const errCode = data?.error?.code ?? res.status;
      const errMsg = data?.error?.message ?? "Unknown Meta API error";
      console.error(`[WHATSAPP] API error ${errCode}: ${errMsg}`);
      return { success: false, error: errMsg };
    }

    const messageId: string | undefined = data?.messages?.[0]?.id;
    return { success: true, messageId };
  } catch (err) {
    clearTimeout(timeoutId);
    const isTimeout = err instanceof Error && err.name === "AbortError";
    const message = isTimeout ? "Request timed out after 5s" : String(err);
    console.error(`[WHATSAPP] ${message}`);
    return { success: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// High-level notification helpers
// ---------------------------------------------------------------------------

/**
 * Sends a bilingual (Arabic / French) registration alert to the administrator.
 * Covers both student and teacher registrations.
 * Falls back to ADMIN_WHATSAPP_NUMBER env var when adminPhone is not supplied.
 */
export async function notifyAdminNewRegistration(
  params: RegistrationNotificationParams,
): Promise<WhatsAppResult> {
  // Phone resolution: explicit param → ADMIN_WHATSAPP_NUMBER env fallback
  const adminPhone =
    params.adminPhone?.trim() || process.env.ADMIN_WHATSAPP_NUMBER;

  if (!adminPhone) {
    console.warn(
      "[WHATSAPP] No admin phone number available (param and ADMIN_WHATSAPP_NUMBER are both missing). " +
        "Skipping notification.",
    );
    return { success: false, error: "No admin phone number configured" };
  }

  const isStudent = params.type === "student";
  const typeLabel = isStudent
    ? "طالب جديد / Nouvel Étudiant"
    : "أستاذ جديد / Nouvel Enseignant";
  const emoji = isStudent ? "🎓" : "👨‍🏫";

  const lines: string[] = [
    `${emoji} *تسجيل ${typeLabel}*`,
    `🏢 *المركز / Centre:* ${params.centerName ?? "BayanTech"}`,
    `👤 *الاسم / Nom:* ${params.name}`,
    `📞 *الهاتف / Tél:* ${params.phone}`,
  ];

  if (isStudent && params.grade) {
    lines.push(`📚 *المستوى / Niveau:* ${params.grade}`);
  }
  if (isStudent && (params.parentName || params.parentPhone)) {
    lines.push(
      `👨‍👩‍👦 *ولي الأمر / Tuteur:* ${params.parentName ?? "-"} (${params.parentPhone ?? "-"})`,
    );
  }

  lines.push(`⏰ *التاريخ / Date:* ${new Date().toLocaleString("fr-FR")}`);

  return sendWhatsAppMessage({
    to: adminPhone,
    message: lines.join("\n"),
  });
}
