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

    const where: any = {};
    if (session.user.role === "MANAGER") {
      where.managerId = session.user.id;
    }
    if (scheduleId) {
      where.scheduleId = scheduleId;
    }

    const members = await db.registerMember.findMany({
      where,
      orderBy: { name: "asc" },
    });

    return NextResponse.json(members);
  } catch (error: any) {
    console.error("[REGISTER_MEMBERS_GET_ERROR]", error);
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
    const { scheduleId, members = [] } = body;

    if (!scheduleId) {
      return NextResponse.json(
        { error: "scheduleId is required" },
        { status: 400 },
      );
    }

    const managerId = session.user.role === "MANAGER" ? session.user.id : (body.managerId || session.user.id);

    // Replace register members for this scheduleId
    await db.$transaction(async (tx: any) => {
      await tx.registerMember.deleteMany({
        where: { scheduleId, managerId },
      });

      if (members.length > 0) {
        await tx.registerMember.createMany({
          data: members.map((m: any) => ({
            ...(m.id && { id: m.id }),
            scheduleId,
            externalId: m.externalId || "",
            name: m.name,
            managerId,
          })),
        });
      }
    });

    const updated = await db.registerMember.findMany({
      where: { scheduleId, managerId },
    });

    return NextResponse.json(updated, { status: 201 });
  } catch (error: any) {
    console.error("[REGISTER_MEMBERS_POST_ERROR]", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
