import db from "@/lib/db";
import { NextResponse } from "next/server";

function extractCountry(request: Request): string | null {
  // 1. Vercel
  const vercelCountry = request.headers.get("x-vercel-ip-country");
  if (vercelCountry) return vercelCountry;

  // 2. Netlify
  const netlifyCountry = request.headers.get("x-country");
  if (netlifyCountry) return netlifyCountry;

  const netlifyGeo = request.headers.get("x-nf-geo");
  if (netlifyGeo) {
    try {
      const parsed = JSON.parse(netlifyGeo);
      if (parsed?.country?.code) return parsed.country.code;
    } catch {
      // ignore parse errors
    }
  }

  // 3. Cloudflare / general proxies
  const cfCountry = request.headers.get("cf-ipcountry");
  if (cfCountry) return cfCountry;

  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const event = body?.event ?? "UNKNOWN";
    const country = extractCountry(request);

    const record = await db.freeVersionTelemetry.create({
      data: { event, country },
    });

    return NextResponse.json({ success: true, id: record.id });
  } catch (error) {
    console.error("[Telemetry] Failed to record event:", error);
    // Return 500 but don't break frontend
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET() {
  try {
    const total = await db.freeVersionTelemetry.count();
    const adminRegistered = await db.freeVersionTelemetry.count({
      where: { event: "ADMIN_REGISTERED" },
    });
    const scheduleFirstUse = await db.freeVersionTelemetry.count({
      where: { event: "SCHEDULE_FIRST_USE" },
    });
    const recent = await db.freeVersionTelemetry.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      total,
      byEvent: {
        ADMIN_REGISTERED: adminRegistered,
        SCHEDULE_FIRST_USE: scheduleFirstUse,
      },
      recent,
    });
  } catch (error) {
    console.error("[Telemetry] Failed to fetch telemetry:", error);
    return NextResponse.json(
      { error: "Failed to fetch telemetry" },
      { status: 500 }
    );
  }
}
