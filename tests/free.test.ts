import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import React from "react";
import { getDb, Role, ReceiptType } from "@/freelib/dexie/dbSchema";
import {
  userActions,
  centerActions,
  subjectActions,
  scheduleActions,
  teacherSubjectActions,
  studentSubjectActions,
  receiptActions,
  deleteCenterWithRelations,
} from "@/freelib/dexie/freedexieaction";
import { encrypt, decrypt } from "@/freelib/authentication";
import { loginWithRole } from "@/freelib/actionsClient";
import { AuthProvider, useAuth } from "@/freelib/context/freeauthContext";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "en",
}));

describe("Free Edition (Local Dexie & Client Auth)", () => {
  beforeEach(async () => {
    const db = getDb();
    await db.open();
    // Clear all tables before each test
    await Promise.all([
      db.users.clear(),
      db.centers.clear(),
      db.teachers.clear(),
      db.students.clear(),
      db.subjects.clear(),
      db.teacherSubjects.clear(),
      db.studentSubjects.clear(),
      db.receipts.clear(),
      db.schedules.clear(),
    ]);
  });

  describe("Authentication JWT Helpers", () => {
    it("encrypts and decrypts a user payload correctly", async () => {
      const payload = {
        user: {
          id: "u-1",
          name: "Test User",
          email: "user@test.local",
          role: "ADMIN",
        },
      };

      const token = await encrypt(payload);
      expect(typeof token).toBe("string");
      expect(token.length).toBeGreaterThan(20);

      const decrypted = await decrypt(token);
      expect(decrypted).toBeDefined();
      expect((decrypted as any).user.email).toBe("user@test.local");
      expect((decrypted as any).user.role).toBe("ADMIN");
    });
  });

  describe("Dexie User and Center Actions", () => {
    it("creates, retrieves, and queries user by email", async () => {
      const now = Date.now();
      const adminUser = {
        id: "admin-123",
        name: "Admin Zakaria",
        email: "admin@bayantech.local",
        password: "securepassword",
        role: Role.ADMIN,
        createdAt: now,
        updatedAt: now,
      };

      await userActions.putLocal(adminUser);

      // Verify retrieval by ID
      const userById = await userActions.getLocal("admin-123");
      expect(userById).toBeDefined();
      expect(userById?.name).toBe("Admin Zakaria");

      // Verify retrieval by Email
      const userByEmail = await userActions.getLocalByEmail?.("admin@bayantech.local");
      expect(userByEmail).toBeDefined();
      expect(userByEmail?.id).toBe("admin-123");
      expect(userByEmail?.role).toBe(Role.ADMIN);
    });

    it("creates a center and performs cascade deletion on related records", async () => {
      const now = Date.now();
      const centerId = "center-1";

      await centerActions.putLocal({
        id: centerId,
        name: "Bayan Tech Center",
        classrooms: ["Room 1", "Room 2"],
        workingDays: ["Monday", "Tuesday"],
        adminId: "admin-123",
        createdAt: now,
        updatedAt: now,
      });

      await subjectActions.putLocal({
        id: "subject-1",
        name: "Mathematics",
        grade: "Bac",
        price: 50,
        centerId: centerId,
        createdAt: now,
        updatedAt: now,
      });

      await scheduleActions.putLocal({
        id: "schedule-1",
        day: "Monday",
        startTime: "09:00",
        endTime: "11:00",
        roomId: "Room 1",
        teacherId: "teacher-1",
        subjectId: "subject-1",
        centerId: centerId,
        createdAt: now,
        updatedAt: now,
      });

      await teacherSubjectActions.putLocal({
        id: "ts-1",
        teacherId: "teacher-1",
        subjectId: "subject-1",
        assignedAt: now,
        createdAt: now,
        updatedAt: now,
      });

      await studentSubjectActions.putLocal({
        id: "ss-1",
        studentId: "student-1",
        subjectId: "subject-1",
        teacherId: "teacher-1",
        enrolledAt: now,
        createdAt: now,
        updatedAt: now,
      });

      // Verify records exist
      expect(await centerActions.getLocal(centerId)).toBeDefined();
      expect(await subjectActions.getLocal("subject-1")).toBeDefined();
      expect(await scheduleActions.getLocal("schedule-1")).toBeDefined();

      // Perform cascade delete
      await deleteCenterWithRelations(centerId);

      // Verify center and all related records are deleted
      expect(await centerActions.getLocal(centerId)).toBeUndefined();
      expect(await subjectActions.getLocal("subject-1")).toBeUndefined();
      expect(await scheduleActions.getLocal("schedule-1")).toBeUndefined();
      expect(await teacherSubjectActions.getLocal("ts-1")).toBeUndefined();
      expect(await studentSubjectActions.getLocal("ss-1")).toBeUndefined();
    });

    it("creates receipts and queries them", async () => {
      const now = Date.now();
      await receiptActions.putLocal({
        id: "rec-1",
        receiptNumber: "REC-2026-001",
        amount: 150,
        type: ReceiptType.STUDENT_PAYMENT,
        date: now,
        studentId: "student-1",
        createdAt: now,
        updatedAt: now,
      });

      const receipt = await receiptActions.getLocal("rec-1");
      expect(receipt).toBeDefined();
      expect(receipt?.receiptNumber).toBe("REC-2026-001");
      expect(receipt?.amount).toBe(150);
      expect(receipt?.type).toBe(ReceiptType.STUDENT_PAYMENT);
    });
  });

  describe("Free Edition Client Login (loginWithRole)", () => {
    it("fails when email or password is missing", async () => {
      const formData = new FormData();
      formData.append("email", "");
      formData.append("password", "");

      const result = await loginWithRole(null, formData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.field).toBe("general");
      }
    });

    it("fails when user does not exist in local IndexedDB", async () => {
      const formData = new FormData();
      formData.append("email", "nonexistent@test.local");
      formData.append("password", "anyPassword");

      const result = await loginWithRole(null, formData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.field).toBe("email");
      }
    });

    it("fails when password is incorrect", async () => {
      const now = Date.now();
      await userActions.putLocal({
        id: "admin-login-test",
        name: "Admin User",
        email: "valid@test.local",
        password: "correctPassword",
        role: Role.ADMIN,
        createdAt: now,
        updatedAt: now,
      });

      const formData = new FormData();
      formData.append("email", "valid@test.local");
      formData.append("password", "wrongPassword");

      const result = await loginWithRole(null, formData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.field).toBe("password");
      }
    });

    it("succeeds with valid admin credentials", async () => {
      const now = Date.now();
      await userActions.putLocal({
        id: "admin-success",
        name: "Super Admin",
        email: "superadmin@test.local",
        password: "secretPassword",
        role: Role.ADMIN,
        createdAt: now,
        updatedAt: now,
      });

      const formData = new FormData();
      formData.append("email", "superadmin@test.local");
      formData.append("password", "secretPassword");

      const result = await loginWithRole(null, formData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.user.email).toBe("superadmin@test.local");
        expect(result.data.user.role).toBe(Role.ADMIN);
      }
    });
  });

  describe("AuthProvider Context", () => {
    it("provides initial state and allows logging in and updating state", async () => {
      localStorage.clear();

      const wrapper = ({ children }: { children: React.ReactNode }) =>
        React.createElement(AuthProvider, null, children);


      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);

      // Perform login
      act(() => {
        result.current.login({
          id: "auth-u-1",
          name: "Auth User",
          email: "auth@test.local",
          role: Role.ADMIN,
        });
      });

      expect(result.current.user?.email).toBe("auth@test.local");
      expect(result.current.isAuthenticated).toBe(true);
      expect(localStorage.getItem("last-auth-user")).toContain("auth@test.local");
    });
  });
});

