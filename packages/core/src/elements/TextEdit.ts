import { TextElement } from "./text_element.ts";

/** A single or multi-line editable text field. */
export class TextEditElement extends TextElement {
  declare element: HTMLInputElement | HTMLTextAreaElement;

  constructor(multiLine = false) {
    super(multiLine ? "textarea" : "input");
    if (!multiLine) (this.element as HTMLInputElement).type = "text";
  }

  /** Sets editable text (input value, not innerText). */
  override SetText(text: string) {
    this.element.value = text;
    return this;
  }

  /** Gets current editable text. */
  override GetText(): string {
    return this.element.value;
  }

  /** Sets placeholder hint text. */
  SetHint(hint: string) {
    this.element.placeholder = hint;
    return this;
  }

  /** Fires as the user types. */
  SetOnChange(callback: (text: string) => void) {
    this.element.addEventListener("input", () => callback(this.GetText()));
    return this;
  }
}
