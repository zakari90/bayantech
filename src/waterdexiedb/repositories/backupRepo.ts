import { waterDb } from "../db";
import { WaterSettings, Member, Reading, Payment, Expense } from "../types";
import { centimesToMad } from "../billing";
import { markBackupCompleted } from "./settingsRepo";
import { getAllMembersSummaries } from "./membersRepo";

export interface DatabaseBackupFile {
  version: number;
  appName: string;
  exportedAt: string;
  data: {
    settings: WaterSettings[];
    members: Member[];
    readings: Reading[];
    payments: Payment[];
    expenses: Expense[];
  };
}

/**
 * Export entire IndexedDB database to a downloadable JSON file.
 */
export async function exportDatabaseToJSON(): Promise<{ blob: Blob; filename: string }> {
  const [settings, members, readings, payments, expenses] = await Promise.all([
    waterDb.settings.toArray(),
    waterDb.members.toArray(),
    waterDb.readings.toArray(),
    waterDb.payments.toArray(),
    waterDb.expenses.toArray(),
  ]);

  const backupData: DatabaseBackupFile = {
    version: 1,
    appName: "WaterAssociationManager",
    exportedAt: new Date().toISOString(),
    data: {
      settings,
      members,
      readings,
      payments,
      expenses,
    },
  };

  const jsonString = JSON.stringify(backupData, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const dateStr = new Date().toISOString().split("T")[0];
  const filename = `water_association_backup_${dateStr}.json`;

  await markBackupCompleted();

  return { blob, filename };
}

/**
 * Import and validate JSON backup file into IndexedDB.
 */
export async function importDatabaseFromJSON(jsonString: string): Promise<{
  success: boolean;
  message: string;
  counts: { members: number; readings: number; payments: number; expenses: number };
}> {
  let parsed: DatabaseBackupFile;
  try {
    parsed = JSON.parse(jsonString);
  } catch (err) {
    return { success: false, message: "Invalid JSON format", counts: { members: 0, readings: 0, payments: 0, expenses: 0 } };
  }

  if (!parsed.data || !Array.isArray(parsed.data.members) || !Array.isArray(parsed.data.readings)) {
    return {
      success: false,
      message: "JSON file does not match Water Association schema.",
      counts: { members: 0, readings: 0, payments: 0, expenses: 0 },
    };
  }

  await waterDb.transaction(
    "rw",
    [waterDb.settings, waterDb.members, waterDb.readings, waterDb.payments, waterDb.expenses],
    async () => {
      await waterDb.settings.clear();
      await waterDb.members.clear();
      await waterDb.readings.clear();
      await waterDb.payments.clear();
      await waterDb.expenses.clear();

      if (parsed.data.settings?.length) {
        await waterDb.settings.bulkAdd(parsed.data.settings);
      }
      if (parsed.data.members?.length) {
        await waterDb.members.bulkAdd(parsed.data.members);
      }
      if (parsed.data.readings?.length) {
        await waterDb.readings.bulkAdd(parsed.data.readings);
      }
      if (parsed.data.payments?.length) {
        await waterDb.payments.bulkAdd(parsed.data.payments);
      }
      if (parsed.data.expenses?.length) {
        await waterDb.expenses.bulkAdd(parsed.data.expenses);
      }
    }
  );

  return {
    success: true,
    message: "Data successfully restored",
    counts: {
      members: parsed.data.members?.length || 0,
      readings: parsed.data.readings?.length || 0,
      payments: parsed.data.payments?.length || 0,
      expenses: parsed.data.expenses?.length || 0,
    },
  };
}

/**
 * Completely clear/delete all data from IndexedDB (members, readings, payments, expenses, settings).
 */
export async function clearAllDatabaseData(): Promise<void> {
  await waterDb.transaction(
    "rw",
    [waterDb.settings, waterDb.members, waterDb.readings, waterDb.payments, waterDb.expenses],
    async () => {
      await waterDb.settings.clear();
      await waterDb.members.clear();
      await waterDb.readings.clear();
      await waterDb.payments.clear();
      await waterDb.expenses.clear();
    }
  );
}

/**
 * Export member balances and list to CSV format.
 */
export async function exportMembersToCSV(): Promise<{ blob: Blob; filename: string }> {
  const summaries = await getAllMembersSummaries();

  const headers = ["الرقم (ID)", "اسم المنخرط", "رقم العداد", "الهاتف", "بداية العداد", "مجموع الفواتير (درهم)", "مجموع الأداء (درهم)", "الرصيد المتبقي (درهم)", "الحالة"];
  const rows = summaries.map((s) => [
    s.member.id,
    `"${s.member.name}"`,
    s.member.meterNumber,
    s.member.phone || "",
    s.member.startIndex,
    centimesToMad(s.totalBilled).toFixed(2),
    centimesToMad(s.totalPaid).toFixed(2),
    centimesToMad(s.balance).toFixed(2),
    s.balance > 0 ? "مدين" : s.balance === 0 ? "خالص" : "فائض",
  ]);

  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const filename = `members_balances_${new Date().toISOString().split("T")[0]}.csv`;

  return { blob, filename };
}

/**
 * Export General Assembly Annual Financial Report to CSV.
 */
export async function exportFinancialReportToCSV(year: number): Promise<{ blob: Blob; filename: string }> {
  const [payments, expenses, summaries] = await Promise.all([
    waterDb.payments.toArray(),
    waterDb.expenses.toArray(),
    getAllMembersSummaries(),
  ]);

  const yearStr = String(year);
  const yearPayments = payments.filter((p) => p.date.startsWith(yearStr));
  const yearExpenses = expenses.filter((e) => e.date.startsWith(yearStr));

  const totalCollected = yearPayments.reduce((acc, p) => acc + p.amount, 0);
  const totalExp = yearExpenses.reduce((acc, e) => acc + e.amount, 0);
  const totalArrears = summaries.reduce((acc, s) => acc + Math.max(0, s.balance), 0);

  const lines = [
    `التقرير المالي السنوي للجمعية - سنة ${year}`,
    `تاريخ الاستخراج: ${new Date().toLocaleDateString("ar-MA")}`,
    "",
    "--- المداخيل والمصاريف ---",
    `مجموع المداخيل المستخلصة (درهم),${centimesToMad(totalCollected).toFixed(2)}`,
    `مجموع المصاريف الإجمالية (درهم),${centimesToMad(totalExp).toFixed(2)}`,
    `صافي الرصيد المالي المتبقي (درهم),${centimesToMad(totalCollected - totalExp).toFixed(2)}`,
    `مجموع البواقي غير المستخلصة (ديون المنخرطين),${centimesToMad(totalArrears).toFixed(2)}`,
    "",
    "--- تفاصيل المصاريف حسب الصنف ---",
    "الصنف,المبلغ (درهم)",
    `كهرباء المضخة,${centimesToMad(yearExpenses.filter((e) => e.category === "electricity").reduce((a, b) => a + b.amount, 0)).toFixed(2)}`,
    `إصلاحات وشبكة التوزيع,${centimesToMad(yearExpenses.filter((e) => e.category === "repairs").reduce((a, b) => a + b.amount, 0)).toFixed(2)}`,
    `صيانة المضخة والبئر,${centimesToMad(yearExpenses.filter((e) => e.category === "pump").reduce((a, b) => a + b.amount, 0)).toFixed(2)}`,
    `مصاريف إدارية ومكتبية,${centimesToMad(yearExpenses.filter((e) => e.category === "admin").reduce((a, b) => a + b.amount, 0)).toFixed(2)}`,
    `أخرى,${centimesToMad(yearExpenses.filter((e) => e.category === "other").reduce((a, b) => a + b.amount, 0)).toFixed(2)}`,
  ];

  const csvContent = "\uFEFF" + lines.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const filename = `financial_report_${year}.csv`;

  return { blob, filename };
}
