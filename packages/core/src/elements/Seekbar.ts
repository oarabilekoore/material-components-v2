import { BaseElement } from "./base_element.ts";

/** A draggable slider for numeric input. */
export class SeekBarElement extends BaseElement {
  declare element: HTMLInputElement;

  constructor() {
    super("input");
    this.element.type = "range";
    this.element.min = "0";
    this.element.max = "100";
  }

  /** Sets the slider's min/max range. */
  SetRange(min: number, max: number) {
    this.element.min = `${min}`;
    this.element.max = `${max}`;
    return this;
  }

  /** Sets current value. */
  SetValue(value: number) {
    this.element.value = `${value}`;
    return this;
  }

  /** Gets current value. */
  GetValue(): number {
    return Number(this.element.value);
  }

  /** Fires while dragging. */
  SetOnChange(callback: (value: number) => void) {
    this.element.addEventListener("input", () => callback(this.GetValue()));
    return this;
  }
}
