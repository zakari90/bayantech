import { getSettings, updateSettings } from "./repositories/settingsRepo";

const SESSION_AUTH_KEY = "water_assoc_auth_session";

/**
 * Check if the user is currently authenticated in this browser session.
 */
export function isUserAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(SESSION_AUTH_KEY) === "true";
  } catch {
    return false;
  }
}

/**
 * Mark the current browser session as authenticated.
 */
export function setAuthenticatedSession(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SESSION_AUTH_KEY, "true");
  } catch (e) {
    console.error("Failed to set auth session:", e);
  }
}

/**
 * Log out and clear the session authentication.
 */
export function logoutSession(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(SESSION_AUTH_KEY);
  } catch (e) {
    console.error("Failed to clear auth session:", e);
  }
}

/**
 * Check if security passcode protection is enabled.
 */
export async function isSecurityPinEnabled(): Promise<boolean> {
  const s = await getSettings();
  return Boolean(s.pinEnabled);
}

/**
 * Verify an entered passcode against the stored PIN.
 */
export async function verifyPinCode(inputPin: string): Promise<boolean> {
  const s = await getSettings();
  const validPin = (s.pinCode || "1234").trim();
  const isValid = inputPin.trim() === validPin;
  if (isValid) {
    setAuthenticatedSession();
  }
  return isValid;
}

/**
 * Update the PIN code and its active state.
 */
export async function setSecurityPin(pin: string, enabled = true): Promise<void> {
  await updateSettings({
    pinCode: pin.trim(),
    pinEnabled: enabled,
  });
}
