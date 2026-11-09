import { waterDb } from "../db";
import { WaterSettings, LanguageCode } from "../types";
import { madToCentimes } from "../billing";

export const DEFAULT_SETTINGS: WaterSettings = {
  id: 1,
  associationName: "جمعية مستخدمي مياه الشرب",
  villageName: "دوار الأمل",
  phone: "",
  pricePerM3: 500, // 5.00 MAD
  fixedFee: 1000, // 10.00 MAD
  readingStartDay: 24, // Day 24 of each month
  readingEndDay: 27, // Day 27 of each month (3 days duration: 24 to 27)
  verificationDay: 28, // Day 28 of each month (one day verification)
  creationDate: new Date().toISOString().split("T")[0],
  language: "ar",
  currency: "MAD",
  onboardingCompleted: false,
  pinCode: "1234",
  pinEnabled: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export async function getSettings(): Promise<WaterSettings> {
  const existing = await waterDb.settings.get(1);
  if (existing) {
    return {
      ...DEFAULT_SETTINGS,
      ...existing,
      readingStartDay: existing.readingStartDay ?? 24,
      readingEndDay: existing.readingEndDay ?? 27,
      verificationDay: existing.verificationDay ?? 28,
      creationDate:
        existing.creationDate ??
        existing.createdAt?.split("T")[0] ??
        new Date().toISOString().split("T")[0],
    };
  }
  // Initialize default if not present
  await waterDb.settings.put(DEFAULT_SETTINGS);
  return DEFAULT_SETTINGS;
}

export async function updateSettings(
  partial: Partial<Omit<WaterSettings, "id">>
): Promise<WaterSettings> {
  const current = await getSettings();
  const updated: WaterSettings = {
    ...current,
    ...partial,
    id: 1,
    updatedAt: new Date().toISOString(),
  };
  await waterDb.settings.put(updated);
  return updated;
}

export async function markBackupCompleted(): Promise<void> {
  const current = await getSettings();
  await waterDb.settings.update(1, {
    lastBackupAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}
