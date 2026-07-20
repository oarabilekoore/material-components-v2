import { Signal, CreateSignal, Bind } from "./signals.ts";

export type WindowSizeClassKey = "Compact" | "Medium" | "Expanded";

const BREAKPOINT_MEDIUM = 600;   // px, matches M3 width breakpoints
const BREAKPOINT_EXPANDED = 840;

let _sizeSignal: Signal<WindowSizeClassKey> | undefined;

function computeClass(width: number): WindowSizeClassKey {
  if (width < BREAKPOINT_MEDIUM) return "Compact";
  if (width < BREAKPOINT_EXPANDED) return "Medium";
  return "Expanded";
}

export const WindowSizeClass = {
  Get(): Signal<WindowSizeClassKey> {
    if (!_sizeSignal) {
      // In SSR or non-browser environments, default to Expanded
      const initialWidth = typeof window !== "undefined" ? window.innerWidth : 1024;
      _sizeSignal = CreateSignal(computeClass(initialWidth));
      
      if (typeof window !== "undefined") {
        window.addEventListener("resize", () => {
          _sizeSignal!.Set(computeClass(window.innerWidth));
        });
      }
    }
    return _sizeSignal;
  },
};
