import { NextRequest, NextResponse } from "next/server";

// Verify token configured in environment variables or fallback for initial setup
const VERIFY_TOKEN =
  process.env.WHATSAPP_VERIFY_TOKEN || "bayan_tech_wa_verify_token_2026";

/**
 * GET /api/whatsapp/webhook
 * Handles Meta's webhook verification handshake when setting up the webhook in Meta Dashboard.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    // Check if mode and token are present in query params
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("[WHATSAPP_WEBHOOK] Verification successful!");
      // Meta strictly expects the hub.challenge number as plain text with 200 OK
      return new NextResponse(challenge, {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    }

    console.warn("[WHATSAPP_WEBHOOK] Verification failed. Token mismatch or invalid mode.");
    return new NextResponse("Forbidden", { status: 403 });
  } catch (error) {
    console.error("[WHATSAPP_WEBHOOK_GET_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

/**
 * POST /api/whatsapp/webhook
 * Receives incoming WhatsApp messages and message status updates (sent, delivered, read) from Meta.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Log the incoming event for diagnostics/debugging
    console.log("[WHATSAPP_WEBHOOK_EVENT]", JSON.stringify(body, null, 2));

    // Meta expects a fast 200 OK response; otherwise it will retry sending the webhook
    return NextResponse.json({ status: "EVENT_RECEIVED" }, { status: 200 });
  } catch (error) {
    console.error("[WHATSAPP_WEBHOOK_POST_ERROR]", error);
    // Even on error, return 200 or 500 depending on requirement; returning 200 prevents Meta hammering
    return NextResponse.json({ status: "ERROR_PARSING" }, { status: 200 });
  }
}
