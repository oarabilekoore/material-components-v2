/**
 * @fileoverview Material Design 3 Theme tokens and management.
 */

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
}

export const lightTheme: M3ThemeTokens = {
  primary: "#6750A4",
  onPrimary: "#FFFFFF",
  primaryContainer: "#EADDFF",
  onPrimaryContainer: "#21005D",
  secondary: "#625B71",
  onSecondary: "#FFFFFF",
  secondaryContainer: "#E8DEF8",
  onSecondaryContainer: "#1D192B",
  tertiary: "#7D5260",
  onTertiary: "#FFFFFF",
  tertiaryContainer: "#FFD8E4",
  onTertiaryContainer: "#31111D",
  error: "#BA1A1A",
  onError: "#FFFFFF",
  errorContainer: "#FFDAD6",
  onErrorContainer: "#410002",
  outline: "#79747E",
  outlineVariant: "#CAC4D0",
  surface: "#FEF7FF",
  surfaceContainer: "#F3EDF7",
  onSurface: "#1D1B20",
  surfaceVariant: "#E7E0EC",
  onSurfaceVariant: "#49454F",
  inverseSurface: "#322F35",
  inverseOnSurface: "#F5EFF7",
  inversePrimary: "#D0BCFF",
  shadow: "#000000",
  scrim: "#000000",
  surfaceTint: "#6750A4",
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
  shapeCornerExtraSmall: 4,
  shapeCornerSmall: 8,
  shapeCornerMedium: 12,
  shapeCornerLarge: 16,
  shapeCornerExtraLarge: 28,
  shapeCornerFull: 9999,
  spacingUnit: 4,
  elevationLevel0: 0,
  elevationLevel1: 1,
  elevationLevel2: 3,
  elevationLevel3: 6,
  elevationLevel4: 8,
  elevationLevel5: 12,
};

export const darkTheme: M3ThemeTokens = {
  primary: "#D0BCFF",
  onPrimary: "#381E72",
  primaryContainer: "#4F378B",
  onPrimaryContainer: "#EADDFF",
  secondary: "#CCC2DC",
  onSecondary: "#332D41",
  secondaryContainer: "#4A4458",
  onSecondaryContainer: "#E8DEF8",
  tertiary: "#EFB8C8",
  onTertiary: "#492532",
  tertiaryContainer: "#633B48",
  onTertiaryContainer: "#FFD8E4",
  error: "#FFB4AB",
  onError: "#690005",
  errorContainer: "#93000A",
  onErrorContainer: "#FFDAD6",
  outline: "#938F99",
  outlineVariant: "#49454F",
  surface: "#141218",
  surfaceContainer: "#211F26",
  onSurface: "#E6E0E9",
  surfaceVariant: "#49454F",
  onSurfaceVariant: "#CAC4D0",
  inverseSurface: "#E6E0E9",
  inverseOnSurface: "#141218",
  inversePrimary: "#6750A4",
  shadow: "#000000",
  scrim: "#000000",
  surfaceTint: "#D0BCFF",
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
  shapeCornerExtraSmall: 4,
  shapeCornerSmall: 8,
  shapeCornerMedium: 12,
  shapeCornerLarge: 16,
  shapeCornerExtraLarge: 28,
  shapeCornerFull: 9999,
  spacingUnit: 4,
  elevationLevel0: 0,
  elevationLevel1: 1,
  elevationLevel2: 3,
  elevationLevel3: 6,
  elevationLevel4: 8,
  elevationLevel5: 12,
};

let currentTheme: M3ThemeTokens = lightTheme;
let currentMode: ThemeMode = "light";

function applyThemeToDocument(theme: M3ThemeTokens): void {
  const root = document.documentElement.style;
  const prefix = "--md-";
  for (const [key, value] of Object.entries(theme)) {
    const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
    root.setProperty(`${prefix}${cssKey}`, String(value));
  }
}
export function SetTheme(
  theme: M3ThemeTokens,
  mode: ThemeMode = "light",
): void {
  currentTheme = theme;
  currentMode = mode;
  document.documentElement.dataset.theme = mode;
  applyThemeToDocument(theme);
}

export function SetThemeMode(mode: ThemeMode): void {
  currentMode = mode;
  currentTheme = mode === "light" ? lightTheme : darkTheme;
  document.documentElement.dataset.theme = mode;
  applyThemeToDocument(currentTheme);
}

export function GetTheme(): M3ThemeTokens {
  return currentTheme;
}

export function GetThemeMode(): ThemeMode {
  return currentMode;
}

export { currentTheme };
