import { BaseElement } from "./BaseElement.ts";

/** A dropdown selection list. */
export class SpinnerElement extends BaseElement {
  declare element: HTMLSelectElement;

  constructor(items: string[] = []) {
    super("select");
    this.SetItems(items);
  }

  /** Replaces all options. */
  SetItems(items: string[]) {
    this.element.innerHTML = "";
    for (const item of items) {
      const opt = document.createElement("option");
      opt.value = item;
      opt.textContent = item;
      this.element.appendChild(opt);
    }
    return this;
  }

  /** Sets the selected index. */
  SetSelection(index: number) {
    this.element.selectedIndex = index;
    return this;
  }

  /** Gets the selected index. */
  GetSelection(): number {
    return this.element.selectedIndex;
  }

  /** Gets the selected item's text. */
  GetText(): string {
    return this.element.value;
  }

  /** Fires when the selection changes. */
  SetOnChange(callback: (index: number, text: string) => void) {
    this.element.addEventListener("change", () =>
      callback(this.GetSelection(), this.GetText()),
    );
    return this;
  }
}
