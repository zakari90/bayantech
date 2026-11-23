import Dexie, { type Table } from "dexie";
import { WaterSettings, Member, Reading, Payment, Expense } from "./types";

export class WaterAssociationDB extends Dexie {
  settings!: Table<WaterSettings, number>;
  members!: Table<Member, string>;
  readings!: Table<Reading, string>;
  payments!: Table<Payment, string>;
  expenses!: Table<Expense, string>;

  constructor() {
    super("WaterAssociationManagerDB");

    // Version 1 Schema
    this.version(1).stores({
      settings: "id",
      members: "id, name, meterNumber, active, createdAt",
      readings: "id, memberId, month, [memberId+month], createdAt",
      payments: "id, memberId, date, createdAt",
      expenses: "id, category, date, createdAt",
    });
  }
}

// Single instance export (lazy / safe for SSR)
export const waterDb = new WaterAssociationDB();

/**
 * Request persistent storage from the browser so IndexedDB data is never evicted.
 */
export async function requestPersistentStorage(): Promise<boolean> {
  if (typeof window !== "undefined" && navigator.storage && navigator.storage.persist) {
    try {
      const isPersisted = await navigator.storage.persist();
      console.log(`[WaterDB] Storage persistence granted: ${isPersisted}`);
      return isPersisted;
    } catch (err) {
      console.warn("[WaterDB] Could not request storage persistence:", err);
      return false;
    }
  }
  return false;
}
