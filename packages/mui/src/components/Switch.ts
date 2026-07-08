import { BaseElement } from "../../../core/src/elements/base_element.ts";
import { LayoutElement } from "../../../core/src/elements/layout_element.ts";
import { currentTheme } from "../theme.ts";

const TRACK_WIDTH = 52;
const TRACK_HEIGHT = 32;
const THUMB_UNSELECTED = 16;
const THUMB_SELECTED = 24;

export class Switch extends BaseElement {
  private input: HTMLInputElement;
  private track: HTMLDivElement;
  private thumb: HTMLDivElement;

  constructor() {
    super("label");
    this.element.className = "m3-switch";
    this.element.style.display = "inline-flex";
    this.element.style.alignItems = "center";
    this.element.style.cursor = "pointer";
    this.element.style.position = "relative";
    this.element.style.width = `${TRACK_WIDTH}px`;
    this.element.style.height = `${TRACK_HEIGHT}px`;

    this.input = document.createElement("input");
    this.input.type = "checkbox";
    this.input.style.position = "absolute";
    this.input.style.opacity = "0";
    this.input.style.width = "0";
    this.input.style.height = "0";

    this.track = document.createElement("div");
    this.track.style.position = "absolute";
    this.track.style.boxSizing = "border-box";
    this.track.style.inset = "0";
    this.track.style.borderRadius = `${TRACK_HEIGHT / 2}px`; // pill: full corner radius
    this.track.style.transition =
      "background-color 0.15s ease, border-color 0.15s ease";

    this.thumb = document.createElement("div");
    this.thumb.style.position = "absolute";
    this.thumb.style.borderRadius = "50%";
    this.thumb.style.transition = "all 0.15s cubic-bezier(0.2, 0, 0, 1)"; // M3's standard easing curve

    this.element.appendChild(this.input);
    this.element.appendChild(this.track);
    this.element.appendChild(this.thumb);

    // focus ring, spec-required for keyboard accessibility
    this.input.addEventListener("focus", () => {
      this.element.style.outline = `2px solid ${currentTheme.primary}`;
      this.element.style.outlineOffset = "2px";
    });
    this.input.addEventListener("blur", () => {
      this.element.style.outline = "none";
    });

    this.input.addEventListener("change", () => {
      this.updateState(this.input.checked);
    });

    this.updateState(false); // initialize in the unselected visual state
  }

  private updateState(checked: boolean): void {
    if (checked) {
      this.track.style.backgroundColor = currentTheme.primary;
      this.track.style.border = "none";

      const inset = (TRACK_HEIGHT - THUMB_SELECTED) / 2; // 4px
      this.thumb.style.width = `${THUMB_SELECTED}px`;
      this.thumb.style.height = `${THUMB_SELECTED}px`;
      this.thumb.style.top = `${inset}px`;
      this.thumb.style.left = `${TRACK_WIDTH - THUMB_SELECTED - inset}px`;
      this.thumb.style.backgroundColor = currentTheme.onPrimary;
    } else {
      this.track.style.backgroundColor = currentTheme.surfaceVariant;
      this.track.style.border = `2px solid ${currentTheme.outline}`;

      const inset = (TRACK_HEIGHT - THUMB_UNSELECTED) / 2; // 8px
      this.thumb.style.width = `${THUMB_UNSELECTED}px`;
      this.thumb.style.height = `${THUMB_UNSELECTED}px`;
      this.thumb.style.top = `${inset}px`;
      this.thumb.style.left = `${inset}px`;
      this.thumb.style.backgroundColor = currentTheme.outline;
    }
  }

  SetChecked(checked: boolean): this {
    this.input.checked = checked;
    this.updateState(checked);
    return this;
  }

  IsChecked(): boolean {
    return this.input.checked;
  }

  /** Enables or disables the switch, per M3's 38% opacity disabled state. */
  SetEnabled(enabled: boolean): this {
    this.input.disabled = !enabled;
    this.element.style.opacity = enabled ? "1" : "0.38";
    this.element.style.cursor = enabled ? "pointer" : "not-allowed";
    this.element.style.pointerEvents = enabled ? "auto" : "none";
    return this;
  }

  SetOnChange(callback: (checked: boolean) => void): this {
    this.input.addEventListener("change", () => callback(this.input.checked));
    return this;
  }

  override GetType(): string {
    return "Switch";
  }
}

export function CreateSwitch(): Switch {
  return new Switch();
}

export function AddSwitch(parent: LayoutElement): Switch {
  const sw = CreateSwitch();
  parent.AddChild(sw);
  return sw;
}
