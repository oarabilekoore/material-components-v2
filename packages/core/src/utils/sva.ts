// core/src/utils/sva.ts

export type StyleValue = Partial<CSSStyleDeclaration> | Record<string, any> | null | undefined | false;

/**
 * mergeStyles function.
 * @param {StyleValue[]} inputs - The inputs parameter
 * @returns {Record<string, any>}
 *
 */
export function mergeStyles(...inputs: StyleValue[]): Record<string, any> {
  const merged: Record<string, any> = {};
  for (const input of inputs) {
    if (input && typeof input === "object") {
      Object.assign(merged, input);
    }
  }
  return merged;
}

type StyleVariantConfig<V> = {
  [K in keyof V]?: {
    [value: string]: StyleValue;
  };
};

type StyleCompoundVariant<V> = {
  [K in keyof V]?: string | number | boolean;
} & { style?: StyleValue };

export interface SVAOptions<V> {
  base?: StyleValue;
  variants?: StyleVariantConfig<V>;
  compoundVariants?: StyleCompoundVariant<V>[];
  defaultVariants?: Partial<V>;
}

const UNITLESS_PROPERTIES = new Set([
  "animationIterationCount",
  "borderImageOutset",
  "borderImageSlice",
  "borderImageWidth",
  "boxFlex",
  "boxFlexGroup",
  "boxOrdinalGroup",
  "columnCount",
  "columns",
  "flex",
  "flexGrow",
  "flexPositive",
  "flexShrink",
  "flexNegative",
  "flexOrder",
  "gridArea",
  "gridRow",
  "gridRowEnd",
  "gridRowSpan",
  "gridRowStart",
  "gridColumn",
  "gridColumnEnd",
  "gridColumnSpan",
  "gridColumnStart",
  "fontWeight",
  "lineClamp",
  "lineHeight",
  "opacity",
  "order",
  "orphans",
  "tabSize",
  "widows",
  "zIndex",
  "zoom",
  "fillOpacity",
  "floodOpacity",
  "stopOpacity",
  "strokeDasharray",
  "strokeDashoffset",
  "strokeMiterlimit",
  "strokeOpacity",
  "strokeWidth",
]);

// Helper to convert camelCase to kebab-case, leaving already kebab/custom properties intact
/**
 * camelToKebab function.
 * @param {string} str - The str parameter
 * @returns {string}
 *
 */
export function camelToKebab(str: string): string {
  if (str.startsWith("--")) return str;
  return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

// Convert a style object to CSS string
/**
 * styleObjectToCss function.
 * @param {Record<string, any>} styleObj - The styleObj parameter
 * @returns {string}
 *
 */
export function styleObjectToCss(styleObj: Record<string, any>): string {
  return Object.entries(styleObj)
    .filter(([_, v]) => v !== undefined && v !== null && v !== false)
    .map(([k, v]) => {
      const key = camelToKebab(k);
      const value = typeof v === "number" && !UNITLESS_PROPERTIES.has(k)
        ? `${v}px`
        : String(v);
      return `${key}: ${value};`;
    })
    .join(" ");
}

let dynamicStyleSheet: CSSStyleSheet | null = null;
const registeredClasses = new Set<string>();

/**
 * getOrCreateStyleSheet function.
 * @returns {CSSStyleSheet | null}
 *
 */
export function getOrCreateStyleSheet(): CSSStyleSheet | null {
  if (typeof document === "undefined") return null;
  if (!dynamicStyleSheet) {
    let styleEl = document.getElementById("m3-dynamic-stylesheet") as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "m3-dynamic-stylesheet";
      document.head.appendChild(styleEl);
    }
    dynamicStyleSheet = styleEl.sheet;
  }
  return dynamicStyleSheet;
}

// Generates a simple hash for class names
/**
 * hashCode function.
 * @param {string} str - The str parameter
 * @returns {string}
 *
 */
export function hashCode(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return "m3-sva-" + Math.abs(hash).toString(36);
}

/**
 * attachStyleObject function.
 * @param {Record<string, any>} styleObj - The styleObj parameter
 * @returns {string}
 *
 */
export function attachStyleObject(styleObj: Record<string, any>): string {
  const cssText = styleObjectToCss(styleObj);
  if (!cssText) return "";
  const className = hashCode(cssText);
  if (!registeredClasses.has(className)) {
    const sheet = getOrCreateStyleSheet();
    if (sheet) {
      try {
        sheet.insertRule(`.${className} { ${cssText} }`, sheet.cssRules.length);
        registeredClasses.add(className);
      } catch (e) {
        console.error("Failed to insert rule for", className, cssText, e);
      }
    }
  }
  return className;
}

/**
 * sva function.
 * @param {SVAOptions<V>} options - The options parameter
 *
 */
export function sva<V extends Record<string, any>>(
  options: SVAOptions<V>
) {
  return (props?: V & { style?: StyleValue }): string => {
    const { base, variants, compoundVariants, defaultVariants } = options;
    const merged = { ...defaultVariants, ...props } as Record<string, any>;

    const activeStyles: StyleValue[] = [];
    if (base) activeStyles.push(base);

    if (variants) {
      for (const [key, values] of Object.entries(variants)) {
        const propValue = merged[key];
        if (propValue !== undefined && propValue !== null && propValue !== false) {
          const valStyle = (values as any)[String(propValue)];
          if (valStyle) activeStyles.push(valStyle);
        }
      }
    }

    if (compoundVariants) {
      for (const cv of compoundVariants) {
        const matches = Object.entries(cv).every(([key, val]) => {
          if (key === "style") return true;
          return merged[key] === val;
        });
        if (matches && cv.style) {
          activeStyles.push(cv.style);
        }
      }
    }

    if (props?.style) {
      activeStyles.push(props.style);
    }

    const mergedStyleObj = mergeStyles(...activeStyles);
    return attachStyleObject(mergedStyleObj);
  };
}
