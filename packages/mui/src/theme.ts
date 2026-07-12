import * as mcu from "@material/material-color-utilities";
import { ThemeProvider as CoreThemeProvider } from "../../core/src/theme.ts";

export type ThemeMode = "light" | "dark";
export type ButtonVariant = "elevated" | "filled" | "filled-tonal" | "outlined" | "text";
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

export interface MuiThemeRadii {
  button: string;
  card: string;
  fab: string;
  chip: string;
  dialog: string;
  menu: string;
  textField: string;
  slider: string;
  progress: string;
  badge: string;
}

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
  radii?: MuiThemeRadii;
  [key: string]: any;
}

function getRandomHexColor(): string {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function generateExpressiveTheme(seedColorHex: string, isDark: boolean, shapeScale: number = 1.0): M3ThemeTokens {
  const argb = mcu.argbFromHex(seedColorHex);
  const hct = mcu.Hct.fromInt(argb);
  const scheme = new mcu.SchemeExpressive(hct, isDark, 0.0);

  const getHex = (dynamicColor: any) => mcu.hexFromArgb(dynamicColor.getArgb(scheme));

  const baseRadii = {
    shapeCornerExtraSmall: 4 * shapeScale,
    shapeCornerSmall: 8 * shapeScale,
    shapeCornerMedium: 12 * shapeScale,
    shapeCornerLarge: 16 * shapeScale,
    shapeCornerExtraLarge: 28 * shapeScale,
    shapeCornerFull: 9999,
  };

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
    
    ...baseRadii,

    spacingUnit: 4,
    elevationLevel0: 0,
    elevationLevel1: 1,
    elevationLevel2: 3,
    elevationLevel3: 6,
    elevationLevel4: 8,
    elevationLevel5: 12,
    shapeScale,

    radii: {
      button: `${baseRadii.shapeCornerFull}px`,
      card: `${baseRadii.shapeCornerMedium}px`,
      fab: `${baseRadii.shapeCornerLarge}px`,
      chip: `${baseRadii.shapeCornerSmall}px`,
      dialog: `${baseRadii.shapeCornerExtraLarge}px`,
      menu: `${baseRadii.shapeCornerExtraSmall}px`,
      textField: `${baseRadii.shapeCornerExtraSmall}px`,
      slider: `${baseRadii.shapeCornerFull}px`,
      progress: `${baseRadii.shapeCornerFull}px`,
      badge: `${baseRadii.shapeCornerFull}px`,
    }
  };
}

export class MuiThemeProvider {
  private static instance: MuiThemeProvider;
  private seedColor: string;
  private mode: ThemeMode = "light";
  private shapeScale: number = 1.0;
  private muiTokens: M3ThemeTokens;
  private customRadii?: Partial<MuiThemeRadii>;

  private constructor() {
    this.seedColor = getRandomHexColor();
    this.muiTokens = this.generateTheme();
    this.applyToCore();
  }

  public static getInstance(): MuiThemeProvider {
    if (!MuiThemeProvider.instance) {
      MuiThemeProvider.instance = new MuiThemeProvider();
    }
    return MuiThemeProvider.instance;
  }

  public getTheme(): M3ThemeTokens {
    return this.muiTokens;
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

  public setRadii(radii: Partial<MuiThemeRadii>): void {
    this.customRadii = { ...this.customRadii, ...radii };
    this.update();
  }

  private generateTheme(): M3ThemeTokens {
    const theme = generateExpressiveTheme(this.seedColor, this.mode === "dark", this.shapeScale);
    if (this.customRadii) {
      theme.radii = { ...theme.radii!, ...this.customRadii };
    }
    return theme;
  }

  private applyToCore(): void {
    const coreProvider = CoreThemeProvider.getInstance();
    
    // Flatten radii for CSS variables
    const flatTokens: Record<string, any> = { ...this.muiTokens };
    if (flatTokens.radii) {
      for (const [key, value] of Object.entries(flatTokens.radii)) {
        flatTokens[`radii${key.charAt(0).toUpperCase() + key.slice(1)}`] = value;
      }
      delete flatTokens.radii;
    }
    
    coreProvider.setTheme(flatTokens, this.mode, "md");
    
    if (typeof document !== "undefined") {
      document.body.style.backgroundColor = this.muiTokens.surface;
      document.body.style.color = this.muiTokens.onSurface;
    }
  }

  private update(): void {
    this.muiTokens = this.generateTheme();
    this.applyToCore();
  }
}

export const currentTheme = new Proxy({} as M3ThemeTokens, {
  get(target, prop) {
    return MuiThemeProvider.getInstance().getTheme()[prop as keyof M3ThemeTokens];
  }
});
export const currentMode = "light";

export function SetThemeMode(mode: ThemeMode): void {
  MuiThemeProvider.getInstance().setMode(mode);
}

export function SetSeedColor(hex?: string): void {
  MuiThemeProvider.getInstance().setSeedColor(hex);
}

export function SetThemeRadiiScale(scale: number): void {
  MuiThemeProvider.getInstance().setShapeScale(scale);
}

export function SetThemeRadii(radii: Partial<MuiThemeRadii>): void {
  MuiThemeProvider.getInstance().setRadii(radii);
}

if (typeof document !== "undefined") {
  MuiThemeProvider.getInstance().setMode("light");
}
