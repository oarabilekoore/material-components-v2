import { LayoutElement } from "./layout_element.ts";
import { BaseElement } from "./base_element.ts";

/** A scrollable vertical list of items. */
export class ListElement extends LayoutElement {
  constructor() {
    super("Linear");
    this.SetOrientation("Vertical");
    this.element.style.overflowY = "auto";
  }

  /** Adds a row to the list. */
  AddItem(item: BaseElement) {
    this.AddChild(item);
    return this;
  }

  /** Removes all items. */
  Clear() {
    this.element.innerHTML = "";
    return this;
  }
}
