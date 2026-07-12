import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { LayoutElement } from "../../../core/src/elements/Layout.ts";
import { currentTheme } from "../theme.ts";
import { sva } from "../../../core/src/utils/sva.ts";

const containerSva = sva({
  base: {
    width: "100%",
    height: "4px",
    position: "relative",
    overflow: "hidden",
    borderRadius: "2px",
    backgroundColor: "var(--md-surface-variant)",
  },
});

const trackSva = sva({
  base: {
    width: "100%",
    height: "100%",
    position: "absolute",
    backgroundColor: "var(--md-surface-variant)",
  },
});

const indicatorSva = sva({
  base: {
    height: "100%",
    position: "absolute",
    backgroundColor: "var(--md-primary)",
    transition: "width 0.2s linear",
  },
  variants: {
    indeterminate: {
      true: {
        width: "50%",
        animation: "m3-linear-indeterminate 2s infinite linear",
      },
      false: {
        animation: "none",
      }
    }
  },
  defaultVariants: { indeterminate: false }
});

export class LinearProgress extends BaseElement {
  private _track: HTMLElement;
  private _indicator!: HTMLElement;

  constructor() {
    super("div");
    this.element.className = "m3-linear-progress " + containerSva();

    this._track = document.createElement("div");
    this._track.className = trackSva();

    this._indicator = document.createElement("div");
    this._indicator.className = indicatorSva({ indeterminate: false });
    this._indicator.style.width = "0%";

    this.element.appendChild(this._track);
    this.element.appendChild(this._indicator);
  }

  SetProgress(value: number | null): this {
    if (value === null) {
      this._indicator.className = indicatorSva({ indeterminate: true });
      this._indicator.style.width = ""; // Use SVA width
      this.ensureAnimations();
    } else {
      this._indicator.className = indicatorSva({ indeterminate: false });
      this._indicator.style.width = `${Math.max(0, Math.min(100, value))}%`;
    }
    return this;
  }

  SetThickness(px: number): this {
    this.element.style.height = `${px}px`;
    return this;
  }

  SetRounded(rounded: boolean): this {
    this.element.style.borderRadius = rounded ? `${this.element.offsetHeight / 2}px` : "0";
    return this;
  }

  private ensureAnimations(): void {
    if (!document.getElementById("m3-progress-anim")) {
      const style = document.createElement("style");
      style.id = "m3-progress-anim";
      style.textContent = `
        @keyframes m3-linear-indeterminate {
          0% { left: -50%; width: 50%; }
          100% { left: 100%; width: 50%; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  override GetType(): string {
    return "LinearProgress";
  }
}

function CreateLinearProgress(): LinearProgress {
  return new LinearProgress();
}

/**
 * AddLinearProgress function.
 * @param {LayoutElement} parent - The parent parameter
 * @returns {LinearProgress}
 *
 */
export function AddLinearProgress(parent: LayoutElement): LinearProgress {
  const progress = CreateLinearProgress();
  parent.AddChild(progress);
  return progress;
}
