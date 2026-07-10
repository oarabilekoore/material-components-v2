/** Gets the app's title. */
export function GetAppName(): string {
  return document.title;
}

/** Gets the app version, if set on globalThis.__APP_VERSION__. */
export function GetVersion(): string {
  // deno-lint-ignore no-explicit-any
  return (globalThis as any).__APP_VERSION__ ?? "0.0.0";
}

/** Gets the current language code, e.g. "en-US". */
export function GetAppLangCode(): string {
  return navigator.language;
}

/** Gets all preferred languages, in priority order. */
export function GetAppLanguages(): readonly string[] {
  return navigator.languages;
}

/** Gets the current URL path. */
export function GetPath(): string {
  return globalThis.location.pathname;
}

/** Gets the app's origin URL. */
export function GetAppPath(): string {
  return globalThis.location.origin;
}

/** Checks whether a given browser permission is granted, denied, or prompt. */
export function CheckPermission(
  name: PermissionName,
): Promise<PermissionState> {
  return navigator.permissions.query({ name }).then((status) => status.state);
}

/** True if running in a Vite dev build. */
export function IsDebugging(): boolean {
  // deno-lint-ignore no-explicit-any
  return Boolean((import.meta as any).env?.DEV);
}

/** Gets the runtime type — always "Web" for this framework. */
export function GetType(): string {
  return "Web";
}
