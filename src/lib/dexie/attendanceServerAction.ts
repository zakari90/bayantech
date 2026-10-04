/* eslint-disable @typescript-eslint/no-explicit-any */
import { localDb, TimeTableEntry, AttendanceSession, AttendanceRecord, RegisterMember } from "./dbSchema";
import { timetableEntryActions, attendanceSessionActions } from "./attendanceActions";
import { isOnline } from "../utils/network";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

function getApiUrl(pathname: string) {
  if (typeof window !== "undefined") {
    return pathname;
  }
  return `${baseUrl}${pathname}`;
}

const timetableUrl = getApiUrl("/api/attendance/timetable");
const sessionsUrl = getApiUrl("/api/attendance/sessions");
const membersUrl = getApiUrl("/api/attendance/members");

export const ServerActionAttendance = {
  /**
   * Sync pending timetable entries
   */
  async SyncTimetables() {
    if (!isOnline()) return { success: false, reason: "offline" };

    try {
      const pending = await timetableEntryActions.getSyncTargets();
      for (const entry of pending) {
        if (entry.status === "0") {
          // Deleted
          await fetch(`${timetableUrl}?id=${entry.id}`, {
            method: "DELETE",
            credentials: "include",
          });
          await localDb.timetableEntries.delete(entry.id);
        } else if (entry.status === "w") {
          // Waiting to sync
          const res = await fetch(timetableUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(entry),
          });
          if (res.ok) {
            await timetableEntryActions.markSynced(entry.id);
          }
        }
      }
      return { success: true };
    } catch (err) {
      console.error("[SyncTimetables Error]", err);
      return { success: false, error: err };
    }
  },

  /**
   * Sync pending attendance sessions and records
   */
  async SyncSessions() {
    if (!isOnline()) return { success: false, reason: "offline" };

    try {
      const pending = await attendanceSessionActions.getSyncTargets();
      for (const session of pending) {
        if (session.status === "0") {
          await fetch(`${sessionsUrl}?id=${session.id}`, {
            method: "DELETE",
            credentials: "include",
          });
          await localDb.attendanceSessions.delete(session.id);
          await localDb.attendanceRecords.where("sessionId").equals(session.id).delete();
        } else if (session.status === "w") {
          const records = await localDb.attendanceRecords
            .where("sessionId")
            .equals(session.id)
            .toArray();

          const res = await fetch(sessionsUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              ...session,
              records,
            }),
          });
          if (res.ok) {
            await attendanceSessionActions.markSynced(session.id);
            for (const r of records) {
              await localDb.attendanceRecords.update(r.id, {
                status: "1",
                updatedAt: Date.now(),
              });
            }
          }
        }
      }
      return { success: true };
    } catch (err) {
      console.error("[SyncSessions Error]", err);
      return { success: false, error: err };
    }
  },

  /**
   * Import all attendance data from server
   */
  async ImportFromServer() {
    if (!isOnline()) return { success: false, reason: "offline" };

    try {
      // 1. Timetables
      const ttRes = await fetch(timetableUrl, { credentials: "include" });
      if (ttRes.ok) {
        const timetables = await ttRes.json();
        for (const tt of timetables) {
          await localDb.timetableEntries.put({
            id: tt.id,
            managerId: tt.managerId,
            centerId: tt.centerId || undefined,
            day: tt.day,
            startTime: tt.startTime,
            endTime: tt.endTime,
            name: tt.name,
            status: "1",
            createdAt: new Date(tt.createdAt).getTime(),
            updatedAt: new Date(tt.updatedAt).getTime(),
          });
        }
      }

      // 2. Sessions
      const sessRes = await fetch(sessionsUrl, { credentials: "include" });
      if (sessRes.ok) {
        const sessions = await sessRes.json();
        for (const s of sessions) {
          await localDb.attendanceSessions.put({
            id: s.id,
            managerId: s.managerId,
            institution: s.institution || "",
            month: s.month || "",
            year: s.year || "",
            date: new Date(s.date).getTime(),
            shift: s.shift,
            name: s.name,
            scheduleId: s.scheduleId || undefined,
            status: "1",
            createdAt: new Date(s.createdAt).getTime(),
            updatedAt: new Date(s.updatedAt).getTime(),
          });

          if (s.records && Array.isArray(s.records)) {
            for (const r of s.records) {
              await localDb.attendanceRecords.put({
                id: r.id,
                sessionId: s.id,
                externalId: r.externalId || "",
                name: r.name,
                morning: r.morning || "",
                evening: r.evening || "",
                status: r.status || "P",
                remarks: r.remarks || "",
                updatedAt: new Date(r.updatedAt).getTime(),
              });
            }
          }
        }
      }

      return { success: true };
    } catch (err) {
      console.error("[ImportFromServer Error]", err);
      return { success: false, error: err };
    }
  },

  /**
   * Main sync function
   */
  async Sync() {
    const [ttResult, sessResult] = await Promise.all([
      this.SyncTimetables(),
      this.SyncSessions(),
    ]);

    return {
      timetables: ttResult,
      sessions: sessResult,
    };
  },
};

export default ServerActionAttendance;
