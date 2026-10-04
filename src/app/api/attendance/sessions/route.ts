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
    const scheduleId = searchParams.get("scheduleId");
    const month = searchParams.get("month");
    const year = searchParams.get("year");
    const dateParam = searchParams.get("date");

    const where: any = {};
    if (session.user.role === "MANAGER") {
      where.managerId = session.user.id;
    }
    if (scheduleId) {
      where.scheduleId = scheduleId;
    }
    if (month) {
      where.month = month;
    }
    if (year) {
      where.year = year;
    }
    if (dateParam) {
      const d = new Date(parseInt(dateParam));
      if (!isNaN(d.getTime())) {
        where.date = d;
      }
    }

    const sessions = await db.attendanceSession.findMany({
      where,
      include: {
        records: true,
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(sessions);
  } catch (error: any) {
    console.error("[ATTENDANCE_SESSIONS_GET_ERROR]", error);
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
    const {
      id,
      institution,
      month,
      year,
      date,
      shift,
      name,
      scheduleId,
      records = [],
    } = body;

    if (!date || !shift || !name) {
      return NextResponse.json(
        { error: "Missing required session fields" },
        { status: 400 },
      );
    }

    const managerId = session.user.role === "MANAGER" ? session.user.id : (body.managerId || session.user.id);
    const sessionDate = typeof date === "number" ? new Date(date) : new Date(date);

    const savedSession = await db.$transaction(async (tx: any) => {
      // 1. Upsert session
      const sess = await tx.attendanceSession.upsert({
        where: { id: id || "placeholder" },
        create: {
          ...(id && { id }),
          institution: institution || "",
          month: month || "",
          year: year || "",
          date: sessionDate,
          shift,
          name,
          scheduleId: scheduleId || null,
          managerId,
        },
        update: {
          institution: institution || "",
          month: month || "",
          year: year || "",
          date: sessionDate,
          shift,
          name,
          scheduleId: scheduleId || null,
        },
      });

      // 2. Replace records for this session
      await tx.attendanceRecord.deleteMany({
        where: { sessionId: sess.id },
      });

      if (records && records.length > 0) {
        await tx.attendanceRecord.createMany({
          data: records.map((r: any) => ({
            ...(r.id && { id: r.id }),
            sessionId: sess.id,
            externalId: r.externalId || "",
            name: r.name,
            morning: r.morning || "",
            evening: r.evening || "",
            status: r.status || "P",
            remarks: r.remarks || "",
          })),
        });
      }

      return tx.attendanceSession.findUnique({
        where: { id: sess.id },
        include: { records: true },
      });
    });

    return NextResponse.json(savedSession, { status: 201 });
  } catch (error: any) {
    console.error("[ATTENDANCE_SESSIONS_POST_ERROR]", error);
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

    await db.attendanceSession.deleteMany({
      where,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[ATTENDANCE_SESSIONS_DELETE_ERROR]", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
