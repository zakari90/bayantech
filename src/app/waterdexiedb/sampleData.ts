import { waterDb } from "./db";
import { Member, Reading, Payment, Expense, WaterSettings } from "./types";
import { calculateBillAmount } from "./billing";

export async function seedSampleVillageData(): Promise<void> {
  await waterDb.transaction(
    "rw",
    [waterDb.settings, waterDb.members, waterDb.readings, waterDb.payments, waterDb.expenses],
    async () => {
      // 1. Settings
      const sampleSettings: WaterSettings = {
        id: 1,
        associationName: "جمعية عين الخير لمستخدمي مياه الشرب",
        villageName: "دوار أيت بوعزة",
        phone: "0661234567",
        pricePerM3: 500, // 5.00 MAD / m³
        fixedFee: 1000, // 10.00 MAD monthly maintenance
        language: "ar",
        currency: "MAD",
        onboardingCompleted: true,
        pinCode: "1234",
        pinEnabled: true,
        lastBackupAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await waterDb.settings.put(sampleSettings);

      // Clear existing
      await waterDb.members.clear();
      await waterDb.readings.clear();
      await waterDb.payments.clear();
      await waterDb.expenses.clear();

      // 2. Members
      const members: Member[] = [
        {
          id: "mem_1",
          name: "محمد أيت علي",
          phone: "0661998877",
          meterNumber: "A-01",
          startIndex: 120,
          sector: "الحي الفوقاني",
          active: true,
          createdAt: "2026-08-01T10:00:00Z",
          updatedAt: "2026-08-01T10:00:00Z",
        },
        {
          id: "mem_2",
          name: "فاطمة الزهراء بنسعيد",
          phone: "0670112233",
          meterNumber: "A-02",
          startIndex: 85,
          sector: "الحي الفوقاني",
          active: true,
          createdAt: "2026-08-01T10:00:00Z",
          updatedAt: "2026-08-01T10:00:00Z",
        },
        {
          id: "mem_3",
          name: "إبراهيم بلمقدم",
          phone: "0654443322",
          meterNumber: "A-03",
          startIndex: 210,
          sector: "قرب المسجد",
          active: true,
          createdAt: "2026-08-01T10:00:00Z",
          updatedAt: "2026-08-01T10:00:00Z",
        },
        {
          id: "mem_4",
          name: "الحسين المنصوري",
          phone: "0668776655",
          meterNumber: "B-01",
          startIndex: 340,
          sector: "الحي التحتاني",
          active: true,
          createdAt: "2026-08-01T10:00:00Z",
          updatedAt: "2026-08-01T10:00:00Z",
        },
        {
          id: "mem_5",
          name: "خديجة الداودي",
          phone: "0662334455",
          meterNumber: "B-02",
          startIndex: 50,
          sector: "الحي التحتاني",
          active: true,
          createdAt: "2026-08-01T10:00:00Z",
          updatedAt: "2026-08-01T10:00:00Z",
        },
        {
          id: "mem_6",
          name: "عمر السملالي",
          phone: "0650998811",
          meterNumber: "B-03",
          startIndex: 180,
          sector: "طريق السوق",
          active: true,
          createdAt: "2026-08-01T10:00:00Z",
          updatedAt: "2026-08-01T10:00:00Z",
        },
      ];
      await waterDb.members.bulkAdd(members);

      // 3. Historical Readings (August & September 2026)
      const readings: Reading[] = [
        // August
        {
          id: "rd_aug_1",
          memberId: "mem_1",
          month: "2026-08",
          previousIndex: 120,
          index: 132,
          consumption: 12,
          pricePerM3Applied: 500,
          fixedFeeApplied: 1000,
          billAmount: calculateBillAmount(12, 500, 1000), // 1000 + 6000 = 7000 (70 DH)
          createdAt: "2026-08-30T10:00:00Z",
          updatedAt: "2026-08-30T10:00:00Z",
        },
        {
          id: "rd_aug_2",
          memberId: "mem_2",
          month: "2026-08",
          previousIndex: 85,
          index: 93,
          consumption: 8,
          pricePerM3Applied: 500,
          fixedFeeApplied: 1000,
          billAmount: calculateBillAmount(8, 500, 1000), // 1000 + 4000 = 5000 (50 DH)
          createdAt: "2026-08-30T10:00:00Z",
          updatedAt: "2026-08-30T10:00:00Z",
        },
        {
          id: "rd_aug_3",
          memberId: "mem_3",
          month: "2026-08",
          previousIndex: 210,
          index: 235,
          consumption: 25,
          pricePerM3Applied: 500,
          fixedFeeApplied: 1000,
          billAmount: calculateBillAmount(25, 500, 1000), // 1000 + 12500 = 13500 (135 DH)
          createdAt: "2026-08-30T10:00:00Z",
          updatedAt: "2026-08-30T10:00:00Z",
        },
        // September
        {
          id: "rd_sep_1",
          memberId: "mem_1",
          month: "2026-09",
          previousIndex: 132,
          index: 147,
          consumption: 15,
          pricePerM3Applied: 500,
          fixedFeeApplied: 1000,
          billAmount: calculateBillAmount(15, 500, 1000), // 85 DH
          createdAt: "2026-09-30T10:00:00Z",
          updatedAt: "2026-09-30T10:00:00Z",
        },
        {
          id: "rd_sep_2",
          memberId: "mem_2",
          month: "2026-09",
          previousIndex: 93,
          index: 101,
          consumption: 8,
          pricePerM3Applied: 500,
          fixedFeeApplied: 1000,
          billAmount: calculateBillAmount(8, 500, 1000), // 50 DH
          createdAt: "2026-09-30T10:00:00Z",
          updatedAt: "2026-09-30T10:00:00Z",
        },
        {
          id: "rd_sep_3",
          memberId: "mem_3",
          month: "2026-09",
          previousIndex: 235,
          index: 250,
          consumption: 15,
          pricePerM3Applied: 500,
          fixedFeeApplied: 1000,
          billAmount: calculateBillAmount(15, 500, 1000), // 85 DH
          createdAt: "2026-09-30T10:00:00Z",
          updatedAt: "2026-09-30T10:00:00Z",
        },
      ];
      await waterDb.readings.bulkAdd(readings);

      // 4. Payments
      const payments: Payment[] = [
        {
          id: "pay_1",
          memberId: "mem_1",
          amount: 7000, // 70 DH (Paid August)
          date: "2026-09-05",
          note: "أداء نقدًا لشهر غشت",
          receiptNumber: "REC-202609-0001",
          createdAt: "2026-09-05T12:00:00Z",
        },
        {
          id: "pay_2",
          memberId: "mem_2",
          amount: 10000, // 100 DH (Paid August + September)
          date: "2026-10-02",
          note: "أداء شهرين معاً",
          receiptNumber: "REC-202610-0002",
          createdAt: "2026-10-02T15:00:00Z",
        },
      ];
      await waterDb.payments.bulkAdd(payments);

      // 5. Operating Expenses
      const expenses: Expense[] = [
        {
          id: "exp_1",
          description: "فاتورة استهلاك كهرباء مضخة البئر",
          category: "electricity",
          amount: 45000, // 450 DH
          date: "2026-09-10",
          note: "فاتورة المكتب الوطني للكهرباء",
          createdAt: "2026-09-10T09:00:00Z",
        },
        {
          id: "exp_2",
          description: "تغيير صمام ومحبس الأنبوب الرئيسي",
          category: "repairs",
          amount: 22000, // 220 DH
          date: "2026-09-18",
          note: "أشغال التلحيم وشراء الصمام",
          createdAt: "2026-09-18T14:30:00Z",
        },
        {
          id: "exp_3",
          description: "شراء سجلات وأوراق وصولات الاستخلاص",
          category: "admin",
          amount: 8000, // 80 DH
          date: "2026-09-22",
          createdAt: "2026-09-22T11:00:00Z",
        },
      ];
      await waterDb.expenses.bulkAdd(expenses);
    }
  );
}
