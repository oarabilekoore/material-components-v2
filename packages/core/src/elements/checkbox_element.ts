import { TextElement } from "./text_element.ts";

/** A checkbox with a text label. */
export class CheckBoxElement extends TextElement {
  input: HTMLInputElement;
  private label: HTMLSpanElement;

  constructor() {
    super("label");
    this.element.style.display = "inline-flex";
    this.element.style.alignItems = "center";
    this.element.style.gap = "6px";

    this.input = document.createElement("input");
    this.input.type = "checkbox";
    this.label = document.createElement("span");

    this.element.appendChild(this.input);
    this.element.appendChild(this.label);
  }

  /** Sets displayed label text. */
  override SetText(text: string) {
    this.label.textContent = text;
    return this;
  }

  /** Gets label text. */
  override GetText(): string {
    return this.label.textContent ?? "";
  }

  /** Sets checked state. */
  SetChecked(checked: boolean) {
    this.input.checked = checked;
    return this;
  }

  /** Gets checked state. */
  IsChecked(): boolean {
    return this.input.checked;
  }

  /** Fires when checked state changes. */
  SetOnChange(callback: (checked: boolean) => void) {
    this.input.addEventListener("change", () => callback(this.input.checked));
    return this;
  }
}
