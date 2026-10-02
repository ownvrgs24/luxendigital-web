/** Unsent form input kept in localStorage, so a visitor who leaves can pick
 *  up where they stopped. Expires after a week. Every call is wrapped: with
 *  storage blocked (private mode etc.) forms still work, just unsaved. */
const TTL = 7 * 24 * 60 * 60 * 1000;

export function readDraft<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { savedAt, data } = JSON.parse(raw) as { savedAt: number; data: T };
    if (Date.now() - savedAt <= TTL) return data;
    localStorage.removeItem(key);
  } catch {
    // unreadable — treat as no draft
  }
  return null;
}

/** Saves `data`, or clears the draft when given null. */
export function writeDraft<T>(key: string, data: T | null) {
  try {
    if (data === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), data }));
  } catch {
    // storage blocked
  }
}
