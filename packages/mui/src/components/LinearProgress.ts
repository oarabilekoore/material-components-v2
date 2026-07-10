import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { LayoutElement } from "../../../core/src/elements/Layout.ts";
import { currentTheme } from "../theme.ts";

export class LinearProgress extends BaseElement {
  private _track: HTMLElement;
  private _indicator: HTMLElement;

  constructor() {
    super("div");
    this.element.className = "m3-linear-progress";
    this.element.style.width = "100%";
    this.element.style.height = "4px";
    this.element.style.position = "relative";
    this.element.style.overflow = "hidden";
    this.element.style.borderRadius = "2px";
    this.element.style.backgroundColor = currentTheme.surfaceVariant;

    this._track = document.createElement("div");
    this._track.style.width = "100%";
    this._track.style.height = "100%";
    this._track.style.position = "absolute";
    this._track.style.backgroundColor = currentTheme.surfaceVariant;

    this._indicator = document.createElement("div");
    this._indicator.style.height = "100%";
    this._indicator.style.position = "absolute";
    this._indicator.style.backgroundColor = currentTheme.primary;
    this._indicator.style.transition = "width 0.2s linear";
    this._indicator.style.width = "0%";

    this.element.appendChild(this._track);
    this.element.appendChild(this._indicator);
  }

  SetProgress(value: number | null): this {
    if (value === null) {
      this._indicator.style.width = "50%";
      this._indicator.style.animation =
        "m3-linear-indeterminate 2s infinite linear";
      this.ensureAnimations();
    } else {
      this._indicator.style.animation = "none";
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
