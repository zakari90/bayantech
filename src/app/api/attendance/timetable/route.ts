/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSession } from "@/lib/server-auth";
import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session: any = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const centerId = searchParams.get("centerId");

    const where: any = {};
    if (session.user.role === "MANAGER") {
      where.managerId = session.user.id;
    }
    if (centerId) {
      where.centerId = centerId;
    }

    const entries = await db.timeTableEntry.findMany({
      where,
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(entries);
  } catch (error: any) {
    console.error("[TIMETABLE_GET_ERROR]", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session: any = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, day, startTime, endTime, name, centerId } = body;

    if (!day || !startTime || !endTime || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const managerId = session.user.role === "MANAGER" ? session.user.id : (body.managerId || session.user.id);

    const entry = await db.timeTableEntry.upsert({
      where: { id: id || "placeholder" },
      create: {
        ...(id && { id }),
        day,
        startTime,
        endTime,
        name,
        centerId: centerId || null,
        managerId,
      },
      update: {
        day,
        startTime,
        endTime,
        name,
        centerId: centerId || null,
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error: any) {
    console.error("[TIMETABLE_POST_ERROR]", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session: any = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const where: any = { id };
    if (session.user.role === "MANAGER") {
      where.managerId = session.user.id;
    }

    await db.timeTableEntry.deleteMany({
      where,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[TIMETABLE_DELETE_ERROR]", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
