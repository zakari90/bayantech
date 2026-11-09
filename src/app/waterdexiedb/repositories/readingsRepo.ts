import { waterDb } from "../db";
import { Reading, Member } from "../types";
import { calculateBillAmount, calculateConsumption } from "../billing";
import { getSettings } from "./settingsRepo";

export async function getReadingsForMonth(month: string): Promise<Reading[]> {
  return waterDb.readings.where("month").equals(month).toArray();
}

export async function getReadingsForMember(memberId: string): Promise<Reading[]> {
  const readings = await waterDb.readings.where("memberId").equals(memberId).toArray();
  return readings.sort((a, b) => b.month.localeCompare(a.month));
}

/**
 * Find the most recent reading index before the target month.
 * If no previous reading exists in the database, falls back to member.startIndex.
 */
export async function getPreviousIndexForMember(
  member: Member,
  targetMonth: string
): Promise<{
  previousIndex: number;
  fromPreviousReading: boolean;
  previousReadingMonth?: string;
  monthsElapsed: number;
}> {
  const priorReadings = await waterDb.readings
    .where("memberId")
    .equals(member.id)
    .filter((r) => r.month < targetMonth)
    .toArray();

  if (priorReadings.length === 0) {
    let monthsElapsed = 1;
    try {
      const settings = await getSettings();
      const baseDateStr = member.createdAt || settings.creationDate;
      if (baseDateStr) {
        const createdDate = new Date(baseDateStr);
        const [targetYear, targetMonthNum] = targetMonth.split("-").map(Number);
        const createdYear = createdDate.getFullYear();
        const createdMonthNum = createdDate.getMonth() + 1;
        const elapsed = (targetYear - createdYear) * 12 + (targetMonthNum - createdMonthNum);
        if (elapsed > 1) {
          monthsElapsed = elapsed;
        }
      }
    } catch {
      monthsElapsed = 1;
    }
    return {
      previousIndex: member.startIndex || 0,
      fromPreviousReading: false,
      monthsElapsed,
    };
  }

  // Sort descending by month
  priorReadings.sort((a, b) => b.month.localeCompare(a.month));
  const latestPrior = priorReadings[0];

  const [targetYear, targetMonthNum] = targetMonth.split("-").map(Number);
  const [priorYear, priorMonthNum] = latestPrior.month.split("-").map(Number);
  const monthsElapsed = Math.max(1, (targetYear - priorYear) * 12 + (targetMonthNum - priorMonthNum));

  return {
    previousIndex: latestPrior.index,
    fromPreviousReading: true,
    previousReadingMonth: latestPrior.month,
    monthsElapsed,
  };
}

/**
 * Save or update a reading for a member and month.
 * Snapshots the current settings' pricePerM3 and fixedFee so old bills never change when rates change.
 */
export async function saveOrUpdateReading({
  member,
  month,
  index,
  customPricePerM3,
  customFixedFee,
  notes,
}: {
  member: Member;
  month: string;
  index: number;
  customPricePerM3?: number;
  customFixedFee?: number;
  notes?: string;
}): Promise<Reading> {
  const settings = await getSettings();
  const priceApplied = customPricePerM3 !== undefined ? customPricePerM3 : settings.pricePerM3;
  const fixedFeeApplied = customFixedFee !== undefined ? customFixedFee : settings.fixedFee;

  const { previousIndex } = await getPreviousIndexForMember(member, month);
  const { consumption } = calculateConsumption(index, previousIndex);
  const billAmount = calculateBillAmount(consumption, priceApplied, fixedFeeApplied);

  // Check if an existing reading exists for [memberId+month]
  const existing = await waterDb.readings
    .where("[memberId+month]")
    .equals([member.id, month])
    .first();

  const id = existing?.id || `rd_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const readingRecord: Reading = {
    id,
    memberId: member.id,
    month,
    index: Number(index),
    previousIndex,
    consumption,
    pricePerM3Applied: priceApplied,
    fixedFeeApplied,
    billAmount,
    notes,
    createdAt: existing?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await waterDb.readings.put(readingRecord);
  return readingRecord;
}

export async function deleteReading(id: string): Promise<void> {
  await waterDb.readings.delete(id);
}
