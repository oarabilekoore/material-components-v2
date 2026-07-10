import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { LayoutElement } from "../../../core/src/elements/Layout.ts";
import { currentTheme } from "../theme.ts";

export class List extends BaseElement {
  constructor() {
    super("ul");
    this.element.className = "m3-list";
    this.element.style.listStyle = "none";
    this.element.style.margin = "0";
    this.element.style.padding = "8px 0";
    this.element.style.backgroundColor = currentTheme.surface;
    this.element.style.color = currentTheme.onSurface;
    this.element.style.fontFamily = currentTheme.fontFamily;
  }

  override GetType(): string {
    return "List";
  }
}

function CreateList(): List {
  return new List();
}

/**
 * AddList function.
 * @param {LayoutElement} parent - The parent parameter
 * @returns {List}
 *
 */
export function AddList(parent: LayoutElement): List {
  const list = CreateList();
  parent.AddChild(list);
  return list;
}
