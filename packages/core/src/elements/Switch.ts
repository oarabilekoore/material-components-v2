import { BaseElement } from "./base_element.ts";

/** An on/off switch. */
export class SwitchElement extends BaseElement {
  input: HTMLInputElement;

  constructor() {
    super("label");
    this.input = document.createElement("input");
    this.input.type = "checkbox";
    this.input.style.width = "40px";
    this.input.style.height = "20px";
    this.element.appendChild(this.input);
  }

  /** Sets on/off state. */
  SetChecked(checked: boolean) {
    this.input.checked = checked;
    return this;
  }

  /** Gets on/off state. */
  IsChecked(): boolean {
    return this.input.checked;
  }

  /** Fires when toggled. */
  SetOnChange(callback: (checked: boolean) => void) {
    this.input.addEventListener("change", () => callback(this.input.checked));
    return this;
  }
}
