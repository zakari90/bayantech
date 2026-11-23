import { z } from "zod";

export type LanguageCode = "ar" | "en" | "fr";

export interface WaterSettings {
  id: number; // Single row: 1
  associationName: string;
  pricePerM3: number; // in centimes (e.g. 500 = 5.00 MAD)
  fixedFee: number; // in centimes (e.g. 1000 = 10.00 MAD)
  language: LanguageCode;
  currency: string; // "MAD" | "درهم"
  lastBackupAt?: string; // ISO string
  onboardingCompleted: boolean;
  villageName?: string;
  phone?: string;
  pinCode?: string; // Optional 4-6 digit passcode for manager access (defaults to '1234' if enabled and unset)
  pinEnabled?: boolean; // Whether PIN lock is active (default false)
  readingStartDay?: number; // Day of month when reading period starts (default: 24)
  readingEndDay?: number; // Day of month when reading period ends (default: 27, duration: 3 days)
  verificationDay?: number; // Verification day each month (default: 28)
  creationDate?: string; // Association founding / reference date (format: "YYYY-MM-DD")
  createdAt: string;
  updatedAt: string;
}

export interface Member {
  id: string;
  name: string;
  phone: string;
  meterNumber: string;
  startIndex: number;
  active: boolean;
  notes?: string;
  sector?: string; // e.g. Douar / Quartier
  createdAt: string;
  updatedAt: string;
}

export interface Reading {
  id: string;
  memberId: string;
  month: string; // Format "YYYY-MM"
  index: number;
  previousIndex: number;
  consumption: number; // index - previousIndex
  pricePerM3Applied: number; // in centimes
  fixedFeeApplied: number; // in centimes
  billAmount: number; // in centimes: fixedFeeApplied + (consumption * pricePerM3Applied)
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  memberId: string;
  amount: number; // in centimes
  date: string; // ISO string (YYYY-MM-DD or full timestamp)
  monthCovered?: string; // e.g. "2026-10" optional target
  note?: string;
  receiptNumber: string;
  createdAt: string;
}

export type ExpenseCategory = "electricity" | "repairs" | "pump" | "admin" | "other";

export interface Expense {
  id: string;
  description: string;
  category: ExpenseCategory;
  amount: number; // in centimes
  date: string; // ISO string
  note?: string;
  receiptImage?: string;
  createdAt: string;
}

export interface MemberFinancialSummary {
  member: Member;
  totalBilled: number; // in centimes
  totalPaid: number; // in centimes
  balance: number; // in centimes (positive = owed / debt, negative = advance credit)
  lastReading?: Reading;
  lastPayment?: Payment;
  unpaidBillsCount: number;
}

export interface AssociationFinancialReport {
  periodYear: number;
  totalIncome: number; // in centimes
  totalExpenses: number; // in centimes
  expensesByCategory: Record<ExpenseCategory, number>; // in centimes
  netCashFlow: number; // in centimes
  totalArrears: number; // in centimes (sum of positive member balances)
  activeMembersCount: number;
  totalWaterDistributedM3: number;
}

// Zod Validation Schemas
export const settingsSchema = z.object({
  associationName: z.string().min(2, "Association name is required"),
  pricePerM3MAD: z.coerce.number().min(0, "Price per m³ must be >= 0"),
  fixedFeeMAD: z.coerce.number().min(0, "Fixed monthly fee must be >= 0"),
  villageName: z.string().optional(),
  phone: z.string().optional(),
  readingStartDay: z.coerce.number().min(1).max(31).default(24),
  readingEndDay: z.coerce.number().min(1).max(31).default(27),
  verificationDay: z.coerce.number().min(1).max(31).default(28),
  creationDate: z.string().optional(),
  currency: z.string().default("MAD"),
  language: z.enum(["ar", "en", "fr"]).default("ar"),
});

export const memberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^$|^[0-9+ ]{8,15}$/, "Invalid phone format").optional().or(z.literal("")),
  meterNumber: z.string().min(1, "Meter number is required"),
  startIndex: z.coerce.number().min(0, "Starting index must be >= 0"),
  active: z.boolean().default(true),
  notes: z.string().optional(),
  sector: z.string().optional(),
});

export const paymentSchema = z.object({
  memberId: z.string().min(1, "Member is required"),
  amountMAD: z.coerce.number().positive("Amount must be greater than 0"),
  date: z.string().min(1, "Date is required"),
  note: z.string().optional(),
});

export const expenseSchema = z.object({
  description: z.string().min(2, "Description is required"),
  category: z.enum(["electricity", "repairs", "pump", "admin", "other"]),
  amountMAD: z.coerce.number().positive("Amount must be greater than 0"),
  date: z.string().min(1, "Date is required"),
  note: z.string().optional(),
});
