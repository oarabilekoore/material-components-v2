import { BaseElement } from "../../../core/src/elements/base_element.ts";
import { LayoutElement } from "../../../core/src/elements/layout_element.ts";
import { currentTheme } from "../theme.ts";

const BOX_SIZE = 18;
const CORNER_RADIUS = 2; // M3 checkbox spec: 2dp, distinct from the theme's shapeCornerExtraSmall (4dp)

export class Checkbox extends BaseElement {
  private input: HTMLInputElement;
  private box: HTMLDivElement;
  private checkmark: HTMLSpanElement;
  private labelSpan: HTMLSpanElement;

  constructor(label = "") {
    super("label");
    this.element.className = "m3-checkbox";
    this.element.style.display = "inline-flex";
    this.element.style.alignItems = "center";
    this.element.style.cursor = "pointer";
    this.element.style.gap = "8px";
    this.element.style.padding = "8px"; // approximates the 40px touch target around an 18px box

    this.input = document.createElement("input");
    this.input.type = "checkbox";
    this.input.style.position = "absolute";
    this.input.style.opacity = "0";
    this.input.style.width = "0";
    this.input.style.height = "0";

    this.box = document.createElement("div");
    this.box.style.width = `${BOX_SIZE}px`;
    this.box.style.height = `${BOX_SIZE}px`;
    this.box.style.borderRadius = `${CORNER_RADIUS}px`;
    this.box.style.border = `2px solid ${currentTheme.outline}`;
    this.box.style.display = "flex";
    this.box.style.alignItems = "center";
    this.box.style.justifyContent = "center";
    this.box.style.transition =
      "background-color 0.1s ease, border-color 0.1s ease";
    this.box.style.boxSizing = "border-box";

    this.checkmark = document.createElement("span");
    this.checkmark.textContent = "✓";
    this.checkmark.style.color = currentTheme.onPrimary;
    this.checkmark.style.fontSize = "13px";
    this.checkmark.style.lineHeight = "1";
    this.checkmark.style.opacity = "0";
    this.checkmark.style.transition = "opacity 0.1s ease";

    this.box.appendChild(this.checkmark);

    this.labelSpan = document.createElement("span");
    this.labelSpan.textContent = label;
    this.labelSpan.style.color = currentTheme.onSurface;
    this.labelSpan.style.fontFamily = currentTheme.fontFamily;
    this.labelSpan.style.fontSize = "14px";

    this.element.appendChild(this.input);
    this.element.appendChild(this.box);
    if (label) this.element.appendChild(this.labelSpan);

    this.input.addEventListener("focus", () => {
      this.box.style.outline = `2px solid ${currentTheme.primary}`;
      this.box.style.outlineOffset = "2px";
    });
    this.input.addEventListener("blur", () => {
      this.box.style.outline = "none";
    });

    this.input.addEventListener("change", () => this.updateState());
    this.updateState();
  }

  private updateState() {
    if (this.input.indeterminate) {
      this.box.style.backgroundColor = currentTheme.primary;
      this.box.style.borderColor = currentTheme.primary;
      this.checkmark.textContent = "—";
      this.checkmark.style.opacity = "1";
    } else if (this.input.checked) {
      this.box.style.backgroundColor = currentTheme.primary;
      this.box.style.borderColor = currentTheme.primary;
      this.checkmark.textContent = "✓";
      this.checkmark.style.opacity = "1";
    } else {
      this.box.style.backgroundColor = "transparent";
      this.box.style.borderColor = currentTheme.outline;
      this.checkmark.style.opacity = "0";
    }
  }

  SetChecked(checked: boolean): this {
    this.input.checked = checked;
    this.input.indeterminate = false;
    this.updateState();
    return this;
  }

  SetIndeterminate(indeterminate: boolean): this {
    this.input.indeterminate = indeterminate;
    this.updateState();
    return this;
  }

  IsChecked(): boolean {
    return this.input.checked;
  }

  override SetEnabled(enabled: boolean): this {
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
    return "Checkbox";
  }
}

export function CreateCheckbox(label = ""): Checkbox {
  return new Checkbox(label);
}

export function AddCheckbox(parent: LayoutElement, label = ""): Checkbox {
  const box = CreateCheckbox(label);
  parent.AddChild(box);
  return box;
}
