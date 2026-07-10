import { LayoutElement } from "./Layout.ts";
import { BaseElement } from "./BaseElement.ts";

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
  override Clear() {
    super.Clear();
    return this;
  }
}
