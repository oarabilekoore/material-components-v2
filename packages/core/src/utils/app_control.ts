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

/** Pauses execution for the given milliseconds. */
export function Wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Enables or disables fullscreen ("kiosk") mode. */
export function SetKioskMode(enable: boolean) {
  if (enable) document.documentElement.requestFullscreen();
  else if (document.fullscreenElement) document.exitFullscreen();
}
/** Info passed to a LoadScript callback once the script has loaded. */
export interface ScriptLoadInfo {
  isTrusted: boolean;
}

/** Dynamically loads a script by path/URL. Calls callback once loaded (or on failure). */
export function LoadScript(
  path: string,
  callback?: (info: ScriptLoadInfo) => void,
) {
  const script = document.createElement("script");
  script.src = path;

  script.onload = (event) => {
    callback?.({ isTrusted: event.isTrusted });
  };

  script.onerror = () => {
    callback?.({ isTrusted: false });
  };

  document.head.appendChild(script);
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

/** Focuses the window, bringing it to the front. */
export function ToFront() {
  globalThis.focus();
}
/** Closes the window/tab. */
export function Quit() {
  globalThis.close();
}

/** Alias for Quit. */
export const Exit = Quit;
