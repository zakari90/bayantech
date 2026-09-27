import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const event = body?.event ?? "UNKNOWN";

    // Vercel automatically injects this header — free country tracking
    const country =
      request.headers.get("x-vercel-ip-country") ?? null;

    await prisma.freeVersionTelemetry.create({
      data: { event, country },
    });

    return NextResponse.json({ success: true });
  } catch {
    // Silently fail — never break the user's local experience
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
