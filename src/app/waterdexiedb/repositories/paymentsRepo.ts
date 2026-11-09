import { waterDb } from "../db";
import { Payment } from "../types";

export async function getPayments(memberId?: string): Promise<Payment[]> {
  let query = waterDb.payments.toCollection();
  if (memberId) {
    query = waterDb.payments.where("memberId").equals(memberId);
  }
  const list = await query.toArray();
  return list.sort((a, b) => b.date.localeCompare(a.date));
}

export async function addPayment(data: {
  memberId: string;
  amount: number; // in centimes
  date: string;
  note?: string;
  monthCovered?: string;
}): Promise<Payment> {
  const count = await waterDb.payments.count();
  const dateObj = new Date(data.date || new Date());
  const yearMonth = `${dateObj.getFullYear()}${String(dateObj.getMonth() + 1).padStart(2, "0")}`;
  const receiptNumber = `REC-${yearMonth}-${String(count + 1).padStart(4, "0")}`;

  const newPayment: Payment = {
    id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    memberId: data.memberId,
    amount: data.amount,
    date: data.date,
    note: data.note,
    monthCovered: data.monthCovered,
    receiptNumber,
    createdAt: new Date().toISOString(),
  };

  await waterDb.payments.add(newPayment);
  return newPayment;
}

export async function deletePayment(id: string): Promise<void> {
  await waterDb.payments.delete(id);
}
