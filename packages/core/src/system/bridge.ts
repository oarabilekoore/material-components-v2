// deno-lint-ignore no-explicit-any
const g = globalThis as any;

/** True if running under Deno, Bun, or Node — any server-capable runtime. */
export const isServerRuntime =
  typeof g.Deno !== "undefined" ||
  typeof g.Bun !== "undefined" ||
  (typeof g.process !== "undefined" && !!g.process.versions?.node);

/** True if running in a browser (has window/document). */
export const isBrowser =
  typeof window !== "undefined" && typeof document !== "undefined";

let bridgeAvailable: boolean | null = null;

async function probeBridge(): Promise<boolean> {
  if (bridgeAvailable !== null) return bridgeAvailable;
  try {
    const res = await fetch("/__bridge__/ping");
    bridgeAvailable = res.ok;
  } catch {
    bridgeAvailable = false;
  }
  return bridgeAvailable;
}

/**
 * Calls a bridge method over HTTP when in a browser with a backend attached.
 * Warns and returns `fallback` if no backend is reachable (plain static web).
 * Never call this from a server runtime — use the native implementation there instead.
 */
export async function callBridge<T>(
  method: string,
  args: unknown[],
  fallback: T,
): Promise<T> {
  if (!isBrowser) return fallback;

  const available = await probeBridge();
  if (!available) {
    console.warn(
      `[bridge] "${method}" ignored — no backend bridge in this environment.`,
    );
    return fallback;
  }

  try {
    const res = await fetch(`/__bridge__/${method}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ args }),
    });
    if (!res.ok) {
      console.warn(`[bridge] "${method}" failed: ${res.status}`);
      return fallback;
    }
    return (await res.json()) as T;
  } catch {
    console.warn(`[bridge] "${method}" failed: network error.`);
    return fallback;
  }
}
