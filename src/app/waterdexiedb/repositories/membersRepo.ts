import { waterDb } from "../db";
import { Member, MemberFinancialSummary } from "../types";
import { computeMemberSummary } from "../billing";

export async function getMembers(onlyActive = false): Promise<Member[]> {
  let query = waterDb.members.toCollection();
  if (onlyActive) {
    query = waterDb.members.filter((m) => m.active);
  }
  const members = await query.toArray();
  // Sort naturally by meter number
  return members.sort((a, b) => a.meterNumber.localeCompare(b.meterNumber, undefined, { numeric: true }));
}

export async function getMemberById(id: string): Promise<Member | undefined> {
  return waterDb.members.get(id);
}

export async function addMember(data: Omit<Member, "id" | "createdAt" | "updatedAt">): Promise<Member> {
  const newMember: Member = {
    ...data,
    id: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await waterDb.members.add(newMember);
  return newMember;
}

export async function updateMember(id: string, partial: Partial<Omit<Member, "id" | "createdAt">>): Promise<void> {
  await waterDb.members.update(id, {
    ...partial,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteMember(id: string): Promise<void> {
  await waterDb.transaction("rw", [waterDb.members, waterDb.readings, waterDb.payments], async () => {
    await waterDb.members.delete(id);
    await waterDb.readings.where("memberId").equals(id).delete();
    await waterDb.payments.where("memberId").equals(id).delete();
  });
}

export async function getMemberFinancialSummary(memberId: string): Promise<MemberFinancialSummary | null> {
  const member = await waterDb.members.get(memberId);
  if (!member) return null;

  const readings = await waterDb.readings.where("memberId").equals(memberId).toArray();
  const payments = await waterDb.payments.where("memberId").equals(memberId).toArray();

  return computeMemberSummary(member, readings, payments);
}

export async function getAllMembersSummaries(): Promise<MemberFinancialSummary[]> {
  const members = await getMembers();
  const allReadings = await waterDb.readings.toArray();
  const allPayments = await waterDb.payments.toArray();

  const readingsByMember = new Map<string, typeof allReadings>();
  for (const r of allReadings) {
    const list = readingsByMember.get(r.memberId) || [];
    list.push(r);
    readingsByMember.set(r.memberId, list);
  }

  const paymentsByMember = new Map<string, typeof allPayments>();
  for (const p of allPayments) {
    const list = paymentsByMember.get(p.memberId) || [];
    list.push(p);
    paymentsByMember.set(p.memberId, list);
  }

  return members.map((member) =>
    computeMemberSummary(
      member,
      readingsByMember.get(member.id) || [],
      paymentsByMember.get(member.id) || []
    )
  );
}
