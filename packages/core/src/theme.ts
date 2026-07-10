/**
 * @fileoverview Material Design 3 Theme tokens and management.
 */

import * as mcu from "@material/material-color-utilities";

export type ThemeMode = "light" | "dark";
export type ButtonVariant =
  "elevated" | "filled" | "filled-tonal" | "outlined" | "text";
export type ButtonSize = "xs" | "s" | "m" | "l" | "xl";
export type CardVariant = "elevated" | "filled" | "outlined";
export type DialogType = "basic" | "full-screen";
export type DrawerVariant = "standard" | "modal";
export type TextFieldVariant = "filled" | "outlined";
export type FabSize = "small" | "medium" | "large";
export type ChipVariant = "assist" | "filter" | "input" | "suggestion";
export type SliderStyle = "continuous" | "discrete";
export type ProgressVariant = "linear" | "circular";
export type BadgeVariant = "small" | "large";
export type TopAppBarVariant = "small" | "medium" | "large" | "center-aligned";

export interface M3ThemeTokens {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;
  outline: string;
  outlineVariant: string;
  surface: string;
  surfaceContainer?: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;
  shadow: string;
  scrim: string;
  surfaceTint: string;
  fontFamily: string;
  headlineLarge: string;
  headlineMedium: string;
  headlineSmall: string;
  titleLarge: string;
  titleMedium: string;
  titleSmall: string;
  bodyLarge: string;
  bodyMedium: string;
  bodySmall: string;
  labelLarge: string;
  labelMedium: string;
  labelSmall: string;
  shapeCornerExtraSmall: number;
  shapeCornerSmall: number;
  shapeCornerMedium: number;
  shapeCornerLarge: number;
  shapeCornerExtraLarge: number;
  shapeCornerFull: number;
  spacingUnit: number;
  elevationLevel0: number;
  elevationLevel1: number;
  elevationLevel2: number;
  elevationLevel3: number;
  elevationLevel4: number;
  elevationLevel5: number;
  shapeScale?: number;
}

function getRandomHexColor(): string {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/**
 * generateExpressiveTheme function.
 * @param {string} seedColorHex - The seedColorHex parameter
 * @param {boolean} isDark - The isDark parameter
 * @param {number} shapeScale - The shapeScale parameter
 * @returns {M3ThemeTokens}
 *
 */
export function generateExpressiveTheme(seedColorHex: string, isDark: boolean, shapeScale: number = 1.0): M3ThemeTokens {
  const argb = mcu.argbFromHex(seedColorHex);
  const hct = mcu.Hct.fromInt(argb);
  // Using SchemeExpressive for a more vibrant, modern feel
  const scheme = new mcu.SchemeExpressive(hct, isDark, 0.0);

  const getHex = (dynamicColor: any) => mcu.hexFromArgb(dynamicColor.getArgb(scheme));

  return {
    primary: getHex(mcu.MaterialDynamicColors.primary),
    onPrimary: getHex(mcu.MaterialDynamicColors.onPrimary),
    primaryContainer: getHex(mcu.MaterialDynamicColors.primaryContainer),
    onPrimaryContainer: getHex(mcu.MaterialDynamicColors.onPrimaryContainer),
    secondary: getHex(mcu.MaterialDynamicColors.secondary),
    onSecondary: getHex(mcu.MaterialDynamicColors.onSecondary),
    secondaryContainer: getHex(mcu.MaterialDynamicColors.secondaryContainer),
    onSecondaryContainer: getHex(mcu.MaterialDynamicColors.onSecondaryContainer),
    tertiary: getHex(mcu.MaterialDynamicColors.tertiary),
    onTertiary: getHex(mcu.MaterialDynamicColors.onTertiary),
    tertiaryContainer: getHex(mcu.MaterialDynamicColors.tertiaryContainer),
    onTertiaryContainer: getHex(mcu.MaterialDynamicColors.onTertiaryContainer),
    error: getHex(mcu.MaterialDynamicColors.error),
    onError: getHex(mcu.MaterialDynamicColors.onError),
    errorContainer: getHex(mcu.MaterialDynamicColors.errorContainer),
    onErrorContainer: getHex(mcu.MaterialDynamicColors.onErrorContainer),
    outline: getHex(mcu.MaterialDynamicColors.outline),
    outlineVariant: getHex(mcu.MaterialDynamicColors.outlineVariant),
    surface: getHex(mcu.MaterialDynamicColors.surface),
    surfaceContainer: getHex(mcu.MaterialDynamicColors.surfaceContainer),
    onSurface: getHex(mcu.MaterialDynamicColors.onSurface),
    surfaceVariant: getHex(mcu.MaterialDynamicColors.surfaceVariant),
    onSurfaceVariant: getHex(mcu.MaterialDynamicColors.onSurfaceVariant),
    inverseSurface: getHex(mcu.MaterialDynamicColors.inverseSurface),
    inverseOnSurface: getHex(mcu.MaterialDynamicColors.inverseOnSurface),
    inversePrimary: getHex(mcu.MaterialDynamicColors.inversePrimary),
    shadow: getHex(mcu.MaterialDynamicColors.shadow),
    scrim: getHex(mcu.MaterialDynamicColors.scrim),
    surfaceTint: getHex(mcu.MaterialDynamicColors.surfaceTint),

    // Default typography and spacing settings
    fontFamily: "Roboto, sans-serif",
    headlineLarge: "400 2rem/1.2",
    headlineMedium: "400 1.75rem/1.2",
    headlineSmall: "400 1.5rem/1.2",
    titleLarge: "400 1.375rem/1.2",
    titleMedium: "500 1rem/1.2",
    titleSmall: "500 0.875rem/1.2",
    bodyLarge: "400 1rem/1.5",
    bodyMedium: "400 0.875rem/1.5",
    bodySmall: "400 0.75rem/1.5",
    labelLarge: "500 0.875rem/1.5",
    labelMedium: "500 0.75rem/1.5",
    labelSmall: "500 0.6875rem/1.5",
    shapeCornerExtraSmall: 4 * shapeScale,
    shapeCornerSmall: 8 * shapeScale,
    shapeCornerMedium: 12 * shapeScale,
    shapeCornerLarge: 16 * shapeScale,
    shapeCornerExtraLarge: 28 * shapeScale,
    shapeCornerFull: 9999, // typically always pill-shaped regardless of scale
    spacingUnit: 4,
    elevationLevel0: 0,
    elevationLevel1: 1,
    elevationLevel2: 3,
    elevationLevel3: 6,
    elevationLevel4: 8,
    elevationLevel5: 12,
    shapeScale,
  };
}

/**
 * applyThemeToDocument function.
 * @param {M3ThemeTokens} theme - The theme parameter
 *
 */
export function applyThemeToDocument(theme: M3ThemeTokens): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement.style;
  const prefix = "--md-";
  for (const [key, value] of Object.entries(theme)) {
    const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
    root.setProperty(`${prefix}${cssKey}`, String(value));
  }
}

export class ThemeProvider {
  private static instance: ThemeProvider;
  private seedColor: string;
  private mode: ThemeMode = "light";
  private shapeScale: number = 1.0;
  private theme: M3ThemeTokens;

  private listeners: Set<(theme: M3ThemeTokens, mode: ThemeMode) => void> = new Set();

  private constructor() {
    this.seedColor = getRandomHexColor();
    this.theme = this.generateTheme();
  }

  public static getInstance(): ThemeProvider {
    if (!ThemeProvider.instance) {
      ThemeProvider.instance = new ThemeProvider();
    }
    return ThemeProvider.instance;
  }

  public getTheme(): M3ThemeTokens {
    return this.theme;
  }

  public getMode(): ThemeMode {
    return this.mode;
  }

  public getSeedColor(): string {
    return this.seedColor;
  }

  public setSeedColor(hex?: string): void {
    this.seedColor = hex || getRandomHexColor();
    this.update();
  }

  public setMode(mode: ThemeMode): void {
    this.mode = mode;
    this.update();
  }

  public setShapeScale(scale: number): void {
    this.shapeScale = scale;
    this.update();
  }

  public subscribe(listener: (theme: M3ThemeTokens, mode: ThemeMode) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private generateTheme(): M3ThemeTokens {
    return generateExpressiveTheme(this.seedColor, this.mode === "dark", this.shapeScale);
  }

  private update(): void {
    this.theme = this.generateTheme();
    applyThemeToDocument(this.theme);
    if (typeof document !== "undefined") {
      document.documentElement.dataset.theme = this.mode;
      document.body.style.backgroundColor = this.theme.surface;
      document.body.style.color = this.theme.onSurface;
    }
    
    currentTheme = this.theme;
    currentMode = this.mode;

    for (const listener of this.listeners) {
      listener(this.theme, this.mode);
    }
  }
}

// Ensure the first load generates random colors
let initialTheme: M3ThemeTokens;
try {
  initialTheme = ThemeProvider.getInstance().getTheme();
} catch (e) {
  // Safe fallback if called too early in node context
  initialTheme = generateExpressiveTheme("#6750A4", false);
}

export let currentTheme: M3ThemeTokens = initialTheme;
export let currentMode: ThemeMode = "light";

/**
 * SetTheme function.
 * @param {M3ThemeTokens} theme - The theme parameter
 * @param {ThemeMode} mode - The mode parameter
 *
 */
export function SetTheme(
  theme: M3ThemeTokens,
  mode: ThemeMode = "light",
): void {
  const provider = ThemeProvider.getInstance();
  provider.setMode(mode);
  // Bypass expressive generation to apply specific manual tokens
  (provider as any).theme = theme;
  currentTheme = theme;
  applyThemeToDocument(theme);
}

/**
 * SetThemeMode function.
 * @param {ThemeMode} mode - The mode parameter
 *
 */
export function SetThemeMode(mode: ThemeMode): void {
  ThemeProvider.getInstance().setMode(mode);
}

/**
 * GetTheme function.
 * @returns {M3ThemeTokens}
 *
 */
export function GetTheme(): M3ThemeTokens {
  return ThemeProvider.getInstance().getTheme();
}

/**
 * GetThemeMode function.
 * @returns {ThemeMode}
 *
 */
export function GetThemeMode(): ThemeMode {
  return ThemeProvider.getInstance().getMode();
}

/**
 * SetSeedColor function.
 * @param {string} hex - The hex parameter
 *
 */
export function SetSeedColor(hex?: string): void {
  ThemeProvider.getInstance().setSeedColor(hex);
}

/**
 * SetThemeRadiiScale function.
 * @param {number} scale - The scale parameter
 *
 */
export function SetThemeRadiiScale(scale: number): void {
  ThemeProvider.getInstance().setShapeScale(scale);
}

if (typeof document !== "undefined") {
  ThemeProvider.getInstance().setMode("light");
}
