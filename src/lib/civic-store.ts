import { useSyncExternalStore } from "react";
import { seedState, type CivicState } from "./civic";

const KEY = "civicsense-demo-v1";
type Snap = { data: CivicState; ready: boolean; error: string | null };
const SERVER: Snap = { data: seedState(), ready: false, error: null };
let snap: Snap = SERVER;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function loadCivic() {
  if (snap.ready) return;
  let data = seedState();
  let error: string | null = null;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as CivicState;
      if (Array.isArray(parsed.issues) && Array.isArray(parsed.contributors)) data = parsed;
    }
  } catch {
    error = "Saved demo data was unreadable, so sample data was restored.";
  }
  snap = { data, ready: true, error };
  emit();
}

/** Applies an update and persists it. Returns false if saving failed (e.g. storage full). */
export function updateCivic(fn: (s: CivicState) => CivicState): boolean {
  const next = fn(snap.data);
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    return false;
  }
  snap = { ...snap, data: next, error: null };
  emit();
  return true;
}

export function resetCivic() {
  localStorage.removeItem(KEY);
  snap = { data: seedState(), ready: true, error: null };
  emit();
}

export function useCivic() {
  return useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    () => snap,
    () => SERVER,
  );
}
