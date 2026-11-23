import { describe, it, expect } from "vitest";
import {
  madToCentimes,
  centimesToMad,
  formatCurrency,
  calculateConsumption,
  calculateBillAmount,
  computeMemberSummary,
} from "./billing";
import { Member, Reading, Payment } from "./types";

describe("Water Association Billing Engine", () => {
  it("converts between MAD decimal and integer centimes without floating drift", () => {
    expect(madToCentimes(12.5)).toBe(1250);
    expect(madToCentimes(0.05)).toBe(5);
    expect(centimesToMad(1250)).toBe(12.5);
    expect(centimesToMad(75)).toBe(0.75);
  });

  it("calculates consumption accurately and handles reversed index safely", () => {
    const normal = calculateConsumption(145, 120);
    expect(normal.consumption).toBe(25);
    expect(normal.isInvalid).toBe(false);

    // If new index is less than previous index
    const lower = calculateConsumption(110, 120);
    expect(lower.consumption).toBe(0);
    expect(lower.isInvalid).toBe(true);
  });

  it("calculates bill according to rule: fixedFee + (consumption * pricePerM3)", () => {
    // 10 m³ at 5.00 MAD (500 centimes) + 10.00 MAD (1000 centimes) fixed fee = 60.00 MAD (6000 centimes)
    const billCentimes = calculateBillAmount(10, 500, 1000);
    expect(billCentimes).toBe(6000);
    expect(centimesToMad(billCentimes)).toBe(60);

    // 0 m³ consumption still incurs the fixed maintenance fee
    const zeroConsumptionBill = calculateBillAmount(0, 500, 1000);
    expect(zeroConsumptionBill).toBe(1000);
  });

  it("computes member balance: sum of bills minus sum of payments", () => {
    const dummyMember: Member = {
      id: "mem_test",
      name: "Ahmed",
      phone: "0600000000",
      meterNumber: "M-01",
      startIndex: 0,
      active: true,
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    };

    const readings: Reading[] = [
      {
        id: "r1",
        memberId: "mem_test",
        month: "2026-01",
        index: 10,
        previousIndex: 0,
        consumption: 10,
        pricePerM3Applied: 500,
        fixedFeeApplied: 1000,
        billAmount: 6000, // 60 MAD
        createdAt: "2026-01-31",
        updatedAt: "2026-01-31",
      },
      {
        id: "r2",
        memberId: "mem_test",
        month: "2026-02",
        index: 25,
        previousIndex: 10,
        consumption: 15,
        pricePerM3Applied: 500,
        fixedFeeApplied: 1000,
        billAmount: 8500, // 85 MAD
        createdAt: "2026-02-28",
        updatedAt: "2026-02-28",
      },
    ];

    const payments: Payment[] = [
      {
        id: "p1",
        memberId: "mem_test",
        amount: 6000, // 60 MAD paid
        date: "2026-02-05",
        receiptNumber: "REC-1",
        createdAt: "2026-02-05",
      },
    ];

    const summary = computeMemberSummary(dummyMember, readings, payments);
    expect(summary.totalBilled).toBe(14500); // 145 MAD
    expect(summary.totalPaid).toBe(6000); // 60 MAD
    expect(summary.balance).toBe(8500); // 85 MAD owed
    expect(summary.lastReading?.month).toBe("2026-02");
  });

  it("formats currency cleanly in Arabic and English", () => {
    expect(formatCurrency(5000, "ar")).toContain("50");
    expect(formatCurrency(5000, "ar")).toContain("درهم");
    expect(formatCurrency(5000, "en")).toBe("50.00 MAD");
  });
});
