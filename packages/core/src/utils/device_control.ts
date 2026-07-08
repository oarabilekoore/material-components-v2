/** Reads text from the system clipboard. */
export function GetClipboardText(): Promise<string> {
  return navigator.clipboard.readText();
}

/** Writes text to the system clipboard. */
export function SetClipboardText(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

/** Vibrates the device for a duration (ms), or a pattern of on/off durations. */
export function Vibrate(pattern: number | number[]): boolean {
  return navigator.vibrate?.(pattern) ?? false;
}

/** Fires on any key press. */
export function SetOnKey(
  callback: (key: string, event: KeyboardEvent) => void,
) {
  globalThis.addEventListener("keydown", (e) => callback(e.key, e));
}

/** Shows the on-screen keyboard by focusing an input/textarea. */
export function ShowKeyboard(target: HTMLInputElement | HTMLTextAreaElement) {
  target.focus();
}

/** Hides the on-screen keyboard by blurring the active element. */
export function HideKeyboard() {
  (document.activeElement as HTMLElement | null)?.blur();
}

let wakeLock: WakeLockSentinel | null = null;

/** Prevents the screen from locking/sleeping while enabled. */
export async function PreventScreenLock(enable: boolean): Promise<void> {
  if (enable) {
    try {
      wakeLock = await navigator.wakeLock.request("screen");
    } catch {
      wakeLock = null;
    }
  } else {
    await wakeLock?.release();
    wakeLock = null;
  }
}

/** Requests permission for and shows a system notification. */
export async function CreateNotification(
  title: string,
  body?: string,
  icon?: string,
): Promise<Notification | null> {
  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }
  if (Notification.permission !== "granted") return null;
  return new Notification(title, { body, icon });
}
