/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Attendance Actions for Pro Tier
 *
 * Ported from freelib/dexie/scheduleDb.ts, adapted to use the pro Dexie
 * schema with SyncStatus tracking and managerId multi-tenancy.
 */

import {
  localDb,
  type AttendanceSession,
  type AttendanceRecord,
  type RegisterMember,
  type TimeTableEntry,
} from "./dbSchema";
import { generateDexieActions } from "./dexieActions";

// Standard CRUD actions (with sync status tracking)
export const timetableEntryActions = generateDexieActions(
  localDb.timetableEntries,
  false,
);

export const attendanceSessionActions = generateDexieActions(
  localDb.attendanceSessions,
  false,
);

// ── TimeTable domain actions ────────────────────────────────────────

export const timeTableActions = {
  save: async (entry: TimeTableEntry) => {
    return await localDb.timetableEntries.put(entry);
  },
  getAll: async () => {
    return await localDb.timetableEntries
      .filter((e) => e.status !== "0")
      .toArray();
  },
  getByManager: async (managerId: string) => {
    return await localDb.timetableEntries
      .where("managerId")
      .equals(managerId)
      .filter((e) => e.status !== "0")
      .toArray();
  },
  delete: async (id: string) => {
    // Mark for deletion (sync-aware)
    await localDb.timetableEntries.update(id, {
      status: "0",
      updatedAt: Date.now(),
    } as any);
  },
  hardDelete: async (id: string) => {
    return await localDb.timetableEntries.delete(id);
  },
};

// ── Attendance domain actions ───────────────────────────────────────

export const attendanceActions = {
  saveSession: async (
    session: AttendanceSession,
    records: AttendanceRecord[],
  ) => {
    return await localDb.transaction(
      "rw",
      [localDb.attendanceSessions, localDb.attendanceRecords],
      async () => {
        await localDb.attendanceSessions.put(session);
        // Clear existing records for this session and replace
        await localDb.attendanceRecords
          .where("sessionId")
          .equals(session.id)
          .delete();
        await localDb.attendanceRecords.bulkPut(records);
      },
    );
  },

  getSession: async (id: string) => {
    const session = await localDb.attendanceSessions.get(id);
    const records = await localDb.attendanceRecords
      .where("sessionId")
      .equals(id)
      .toArray();
    return { session, records };
  },

  getDailySession: async (
    date: number,
    shift: "morning" | "evening",
    name?: string,
    scheduleId?: string,
  ) => {
    let query = localDb.attendanceSessions
      .where("date")
      .equals(date)
      .and((s) => s.shift === shift && s.status !== "0");

    if (scheduleId) {
      query = query.and((s) => s.scheduleId === scheduleId);
    } else if (name) {
      query = query.and((s) => s.name === name);
    }

    const session = await query.first();

    if (session) {
      const records = await localDb.attendanceRecords
        .where("sessionId")
        .equals(session.id)
        .toArray();
      return { session, records };
    }
    return { session: null, records: [] };
  },

  getAllSessions: async (managerId?: string) => {
    if (managerId) {
      return await localDb.attendanceSessions
        .where("managerId")
        .equals(managerId)
        .filter((s) => s.status !== "0")
        .reverse()
        .sortBy("date");
    }
    return await localDb.attendanceSessions
      .filter((s) => s.status !== "0")
      .reverse()
      .sortBy("date");
  },

  deleteSession: async (id: string) => {
    return await localDb.transaction(
      "rw",
      [localDb.attendanceSessions, localDb.attendanceRecords],
      async () => {
        // Mark session for deletion (sync-aware)
        await localDb.attendanceSessions.update(id, {
          status: "0",
          updatedAt: Date.now(),
        } as any);
        // Hard-delete records (they sync via session)
        await localDb.attendanceRecords
          .where("sessionId")
          .equals(id)
          .delete();
      },
    );
  },

  clearSessionRecords: async (sessionId: string) => {
    return await localDb.attendanceRecords
      .where("sessionId")
      .equals(sessionId)
      .delete();
  },

  /**
   * Find the most recent session with the given register name
   * and return its roster (records). Used to pre-populate a new
   * daily session with the persistent names linked to a register.
   */
  getLatestRosterByName: async (registerName: string) => {
    if (!registerName) return [];

    const sessions = await localDb.attendanceSessions
      .orderBy("date")
      .reverse()
      .filter((s) => s.name === registerName && s.status !== "0")
      .limit(1)
      .toArray();

    if (sessions.length === 0) return [];

    const records = await localDb.attendanceRecords
      .where("sessionId")
      .equals(sessions[0].id)
      .toArray();

    return records;
  },

  // ── Permanent Roster Management ─────────────────────────────────

  saveRegisterMembers: async (
    scheduleId: string,
    members: RegisterMember[],
  ) => {
    return await localDb.transaction(
      "rw",
      localDb.registerMembers,
      async () => {
        // Clear old and replace
        await localDb.registerMembers
          .where("scheduleId")
          .equals(scheduleId)
          .delete();
        await localDb.registerMembers.bulkPut(members);
      },
    );
  },

  getRegisterMembers: async (scheduleId: string) => {
    if (!scheduleId) return [];
    return await localDb.registerMembers
      .where("scheduleId")
      .equals(scheduleId)
      .toArray();
  },

  /**
   * Get the full attendance history for one member inside a specific register.
   * Returns sessions ordered newest-first, each with the person's record (or null).
   */
  getMemberHistory: async (
    scheduleId: string,
    memberName: string,
    externalId?: string,
  ): Promise<
    { session: AttendanceSession; record: AttendanceRecord | null }[]
  > => {
    if (!scheduleId) return [];

    const sessions = await localDb.attendanceSessions
      .where("scheduleId")
      .equals(scheduleId)
      .filter((s) => s.status !== "0")
      .sortBy("date");

    const results: {
      session: AttendanceSession;
      record: AttendanceRecord | null;
    }[] = [];

    for (const session of sessions) {
      let record: AttendanceRecord | null = null;
      if (externalId) {
        record =
          (await localDb.attendanceRecords
            .where("sessionId")
            .equals(session.id)
            .and((r) => r.externalId === externalId)
            .first()) ?? null;
      }
      if (!record) {
        record =
          (await localDb.attendanceRecords
            .where("sessionId")
            .equals(session.id)
            .and((r) => r.name === memberName)
            .first()) ?? null;
      }
      results.push({ session, record });
    }

    // newest first
    return results.reverse();
  },

  /**
   * Fetch monthly attendance data for a register.
   * @param monthIndex - 1-based month number (1=Jan … 12=Dec)
   * @param year - 4-digit year string e.g. "2026"
   */
  getMonthlyData: async (
    scheduleId: string,
    monthIndex: number,
    year: string,
  ) => {
    if (!scheduleId)
      return { members: [] as RegisterMember[], sessions: [] as AttendanceSession[], recordsBySession: {} as Record<string, AttendanceRecord[]> };

    const yearNum = parseInt(year);

    // 1. Get all permanent members for this register
    const members = await localDb.registerMembers
      .where("scheduleId")
      .equals(scheduleId)
      .toArray();

    // 2. Get all sessions for this register in this month/year
    const sessions = await localDb.attendanceSessions
      .where("scheduleId")
      .equals(scheduleId)
      .filter((s) => {
        if (s.status === "0") return false;
        const d = new Date(s.date);
        return d.getMonth() + 1 === monthIndex && d.getFullYear() === yearNum;
      })
      .sortBy("date");

    const sessionIds = sessions.map((s) => s.id);

    // 3. Get all records for these sessions
    const records = await localDb.attendanceRecords
      .where("sessionId")
      .anyOf(sessionIds)
      .toArray();

    // Group records by sessionId
    const recordsBySession: Record<string, AttendanceRecord[]> = {};
    records.forEach((r) => {
      if (!recordsBySession[r.sessionId]) recordsBySession[r.sessionId] = [];
      recordsBySession[r.sessionId].push(r);
    });

    // 4. If no permanent members, aggregate from records
    let finalMembers = members;
    if (members.length === 0 && records.length > 0) {
      const uniqueNames = Array.from(new Set(records.map((r) => r.name)));
      finalMembers = uniqueNames.map((name) => ({
        id: `temp-${name}`,
        scheduleId: scheduleId,
        externalId: records.find((r) => r.name === name)?.externalId || "",
        name: name,
        managerId: "",
        syncStatus: "1" as const,
        updatedAt: Date.now(),
      }));
    }

    return { members: finalMembers, sessions, recordsBySession };
  },
};
