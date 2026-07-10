import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { LayoutElement } from "../../../core/src/elements/Layout.ts";
import { currentTheme } from "../theme.ts";

export class Radio extends BaseElement {
  private input: HTMLInputElement;
  private labelEl: HTMLSpanElement;

  constructor(name: string, value: string, label: string = "") {
    super("label");
    this.element.className = "m3-radio";
    this.element.style.display = "inline-flex";
    this.element.style.alignItems = "center";
    this.element.style.gap = "8px";
    this.element.style.cursor = "pointer";
    this.element.style.fontFamily = currentTheme.fontFamily;

    this.input = document.createElement("input");
    this.input.type = "radio";
    this.input.name = name;
    this.input.value = value;
    this.input.style.width = "20px";
    this.input.style.height = "20px";
    this.input.style.accentColor = currentTheme.primary;

    this.labelEl = document.createElement("span");
    this.labelEl.textContent = label;
    this.labelEl.style.color = currentTheme.onSurface;

    this.element.appendChild(this.input);
    this.element.appendChild(this.labelEl);
  }

  SetChecked(checked: boolean): this {
    this.input.checked = checked;
    return this;
  }

  IsChecked(): boolean {
    return this.input.checked;
  }

  GetValue(): string {
    return this.input.value;
  }

  SetOnChange(callback: (checked: boolean, value: string) => void): this {
    this.input.addEventListener("change", () =>
      callback(this.input.checked, this.input.value),
    );
    return this;
  }

  override GetType(): string {
    return "Radio";
  }
}

function CreateRadio(
  name: string,
  value: string,
  label: string = "",
): Radio {
  return new Radio(name, value, label);
}

/**
 * AddRadio function.
 * @param {LayoutElement} parent - The parent parameter
 * @param {string} name - The name parameter
 * @param {string} value - The value parameter
 * @param {string} label - The label parameter
 * @returns {Radio}
 *
 */
export function AddRadio(
  parent: LayoutElement,
  name: string,
  value: string,
  label: string = "",
): Radio {
  const radio = CreateRadio(name, value, label);
  parent.AddChild(radio);
  return radio;
}
