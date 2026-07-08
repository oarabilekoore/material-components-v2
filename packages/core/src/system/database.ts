import { isBrowser } from "./bridge.ts";

// in-memory fallback so this doesn't crash under Deno/Node (non-persistent there)
const memoryStore = new Map<string, string>();

function storageGet(key: string): string | null {
  return isBrowser ? localStorage.getItem(key) : (memoryStore.get(key) ?? null);
}

function storageSet(key: string, value: string) {
  if (isBrowser) localStorage.setItem(key, value);
  else memoryStore.set(key, value);
}

function storageRemove(key: string) {
  if (isBrowser) localStorage.removeItem(key);
  else memoryStore.delete(key);
}

function storageClear() {
  if (isBrowser) localStorage.clear();
  else memoryStore.clear();
}

/** Gets a raw string value. */
export function GetData(key: string): string | null {
  return storageGet(key);
}

/** Sets a raw string value. */
export function SetData(key: string, value: string) {
  storageSet(key, value);
}

/** Clears all stored data. */
export function ClearData() {
  storageClear();
}

/** Loads a boolean, or a default if unset. */
export function LoadBoolean(key: string, def = false): boolean {
  const v = storageGet(key);
  return v === null ? def : v === "true";
}

/** Loads a number, or a default if unset. */
export function LoadNumber(key: string, def = 0): number {
  const v = storageGet(key);
  return v === null ? def : Number(v);
}

/** Loads a string, or a default if unset. */
export function LoadText(key: string, def = ""): string {
  return storageGet(key) ?? def;
}

/** Loads and parses JSON, or a default if unset/invalid. */
export function LoadJson<T>(key: string, def: T): T {
  const v = storageGet(key);
  if (v === null) return def;
  try {
    return JSON.parse(v) as T;
  } catch {
    return def;
  }
}

/** Saves a boolean. */
export function SaveBoolean(key: string, value: boolean) {
  storageSet(key, String(value));
}

/** Saves a number. */
export function SaveNumber(key: string, value: number) {
  storageSet(key, String(value));
}

/** Saves a string. */
export function SaveText(key: string, value: string) {
  storageSet(key, value);
}

/** Saves a JSON-serializable value. */
export function SaveJson(key: string, value: unknown) {
  storageSet(key, JSON.stringify(value));
}

/** Removes a single stored key. */
export function ClearValue(key: string) {
  storageRemove(key);
}

/** Alias for ClearData. */
export const DeleteDatabase = ClearData;
