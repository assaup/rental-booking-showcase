import { CartState } from "./model";

const STORAGE_KEY = "bookingKey";

export function cartFingerprint(state: CartState): string {
  const items = state.items
    .map((item) => `${item.id}:${item.qty}`)
    .sort()
    .join(",");

  return `${state.from}|${state.to}|${items}|${[...state.extras].sort().join(",")}`;
}
function createKey(fingerprint: string): string {
  const key = crypto.randomUUID();
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ key, fingerprint }));
  return key;
}

export function getIdempotencyKey(state: CartState): string {
  const fingerprint = cartFingerprint(state);
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) return createKey(fingerprint);

  try {
    const parsed = JSON.parse(saved);
    if (fingerprint === parsed.fingerprint) {
      return parsed.key;
    }
    return createKey(fingerprint);
  } catch {
    return createKey(fingerprint);
  }
}

export function clearIdempotencyKey(): void {
  localStorage.removeItem(STORAGE_KEY);
}
