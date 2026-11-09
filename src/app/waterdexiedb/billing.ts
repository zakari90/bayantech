import { Reading, Payment, MemberFinancialSummary, Member } from "./types";

/**
 * Convert MAD (Dirhams) decimal to integer centimes (1 MAD = 100 centimes).
 * e.g. 12.50 -> 1250
 */
export function madToCentimes(mad: number): number {
  return Math.round(Number(mad) * 100);
}

/**
 * Convert integer centimes to MAD decimal.
 * e.g. 1250 -> 12.5
 */
export function centimesToMad(centimes: number): number {
  return (centimes || 0) / 100;
}

/**
 * Format centimes into a clean currency string.
 * @param centimes Integer amount in centimes
 * @param locale Current locale ('ar' | 'en' | 'fr')
 */
export function formatCurrency(centimes: number, locale: string = "ar"): string {
  const mad = centimesToMad(centimes);
  const formatted = new Intl.NumberFormat(locale === "ar" ? "ar-MA" : "en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(mad);

  if (locale === "ar") {
    return `${formatted} درهم`;
  }
  return `${formatted} MAD`;
}

/**
 * Calculate water consumption in m³ given current and previous meter readings.
 * Ensures consumption does not go below zero if index is mistakenly entered lower.
 */
export function calculateConsumption(currentIndex: number, previousIndex: number): {
  consumption: number;
  isInvalid: boolean;
} {
  const diff = Number(currentIndex) - Number(previousIndex);
  if (diff < 0) {
    return { consumption: 0, isInvalid: true };
  }
  return { consumption: diff, isInvalid: false };
}

/**
 * Calculate bill amount in centimes for a reading.
 * Billing Rule: billAmount = fixedFeeApplied + (consumption * pricePerM3Applied)
 */
export function calculateBillAmount(
  consumption: number,
  pricePerM3InCentimes: number,
  fixedFeeInCentimes: number
): number {
  const safeConsumption = Math.max(0, Number(consumption) || 0);
  const waterCost = safeConsumption * (Number(pricePerM3InCentimes) || 0);
  return (Number(fixedFeeInCentimes) || 0) + waterCost;
}

/**
 * Compute total balance for a member:
 * Balance = Total Billed - Total Paid
 * Positive = Owed by member (debt / arrears)
 * Negative = Advance credit paid by member
 */
export function computeMemberSummary(
  member: Member,
  readings: Reading[],
  payments: Payment[]
): MemberFinancialSummary {
  const totalBilled = readings.reduce((acc, r) => acc + (r.billAmount || 0), 0);
  const totalPaid = payments.reduce((acc, p) => acc + (p.amount || 0), 0);
  const balance = totalBilled - totalPaid;

  const sortedReadings = [...readings].sort((a, b) => b.month.localeCompare(a.month));
  const sortedPayments = [...payments].sort((a, b) => b.date.localeCompare(a.date));

  return {
    member,
    totalBilled,
    totalPaid,
    balance,
    lastReading: sortedReadings[0],
    lastPayment: sortedPayments[0],
    unpaidBillsCount: balance > 0 ? readings.length : 0,
  };
}

/**
 * Generate a pre-filled WhatsApp link with a courteous bill reminder.
 */
export function generateWhatsAppReminderUrl({
  phone,
  memberName,
  meterNumber,
  associationName,
  month,
  consumptionM3,
  currentBillMAD,
  totalDueMAD,
  locale = "ar",
}: {
  phone: string;
  memberName: string;
  meterNumber: string;
  associationName: string;
  month: string;
  consumptionM3?: number;
  currentBillMAD?: number;
  totalDueMAD: number;
  locale?: string;
}): string {
  // Normalize Moroccan phone number: "06..." or "07..." -> "2126..."
  let cleanPhone = phone.replace(/[^0-9]/g, "");
  if (cleanPhone.startsWith("0")) {
    cleanPhone = "212" + cleanPhone.substring(1);
  }

  let text = "";
  if (locale === "ar") {
    text = `السلام عليكم ورحمة الله،
أخي/أختي ${memberName}،
نود تذكيركم بمستحقات استهلاك الماء الصالح للشرب الخاصة بـ ${associationName}.

رقم العداد: ${meterNumber}
الفترة: ${month}
${consumptionM3 !== undefined ? `الاستهلاك: ${consumptionM3} متر مكعب\n` : ""}${currentBillMAD !== undefined ? `فاتورة الشهر: ${currentBillMAD.toFixed(2)} درهم\n` : ""}المجموع الإجمالي الواجب أداؤه: ${totalDueMAD.toFixed(2)} درهم.

يرجى تسوية المستحقات لدى أمين الجمعية في أقرب وقت. وشكراً لتعاونكم.`;
  } else {
    text = `Hello ${memberName},
This is a gentle reminder regarding your drinking water bill for ${associationName}.

Meter No: ${meterNumber}
Period: ${month}
${consumptionM3 !== undefined ? `Consumption: ${consumptionM3} m³\n` : ""}${currentBillMAD !== undefined ? `Current bill: ${currentBillMAD.toFixed(2)} MAD\n` : ""}Total amount due: ${totalDueMAD.toFixed(2)} MAD.

Please settle your payment with the association treasurer at your earliest convenience. Thank you!`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}
