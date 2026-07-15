/** Opens a URL in a new tab/window. */
export function OpenUrl(url: string) {
  globalThis.open(url, "_blank");
}

/** Opens a native file picker. Resolves with the chosen file, or null if cancelled. */
export function ChooseFile(accept = "*/*"): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.onchange = () => resolve(input.files?.[0] ?? null);
    input.click();
  });
}

/** Plays a sound file. */
export function PlaySound(path: string) {
  new Audio(path).play();
}

/** Enables or disables fullscreen ("kiosk") mode. */
export function SetKioskMode(enable: boolean) {
  if (enable) document.documentElement.requestFullscreen();
  else if (document.fullscreenElement) document.exitFullscreen();
}

/** Shares a file via the OS/browser share sheet, if supported. Returns false if unavailable or cancelled. */
export async function SendFile(
  file: File,
  title?: string,
  text?: string,
): Promise<boolean> {
  if (!navigator.canShare?.({ files: [file] })) return false;
  try {
    await navigator.share({ files: [file], title, text });
    return true;
  } catch {
    return false;
  }
}

/** Closes the window/tab. */
export function Exit() {
  globalThis.close();
}

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
