/**
 * @fileoverview Generic Agnostic Theme Provider for Core package.
 */

export class ThemeProvider {
  private static instance: ThemeProvider;
  private tokens: Record<string, string | number> = {};
  private mode: string = "light";
  private prefix: string = "core";

  private listeners: Set<(tokens: Record<string, string | number>, mode: string) => void> = new Set();

  private constructor() {}

  public static getInstance(): ThemeProvider {
    if (!ThemeProvider.instance) {
      ThemeProvider.instance = new ThemeProvider();
    }
    return ThemeProvider.instance;
  }

  public getTokens(): Record<string, string | number> {
    return this.tokens;
  }

  public getMode(): string {
    return this.mode;
  }

  public setMode(mode: string): void {
    this.mode = mode;
    this.update();
  }

  public setTheme(tokens: Record<string, string | number>, mode?: string, prefix: string = "core"): void {
    this.tokens = tokens;
    if (mode) this.mode = mode;
    this.prefix = prefix;
    this.update();
  }

  public subscribe(listener: (tokens: Record<string, string | number>, mode: string) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private update(): void {
    if (typeof document !== "undefined") {
      const root = document.documentElement.style;
      const cssPrefix = `--${this.prefix}-`;
      
      for (const [key, value] of Object.entries(this.tokens)) {
        const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
        root.setProperty(`${cssPrefix}${cssKey}`, String(value));
      }
      
      document.documentElement.dataset.theme = this.mode;
    }
    
    for (const listener of this.listeners) {
      listener(this.tokens, this.mode);
    }
  }
}

export function SetTheme(
  tokens: Record<string, string | number>,
  mode?: string,
  prefix?: string
): void {
  ThemeProvider.getInstance().setTheme(tokens, mode, prefix);
}

export function SetThemeMode(mode: string): void {
  ThemeProvider.getInstance().setMode(mode);
}

export function GetTheme(): Record<string, string | number> {
  return ThemeProvider.getInstance().getTokens();
}

export function GetThemeMode(): string {
  return ThemeProvider.getInstance().getMode();
}
