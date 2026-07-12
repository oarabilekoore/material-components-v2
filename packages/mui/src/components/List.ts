import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { LayoutElement } from "../../../core/src/elements/Layout.ts";
import { currentTheme } from "../theme.ts";
import { sva } from "../../../core/src/utils/sva.ts";

const listSva = sva({
  base: {
    listStyle: "none",
    margin: "0",
    padding: "8px 0",
    backgroundColor: "var(--md-surface)",
    color: "var(--md-on-surface)",
    fontFamily: "var(--md-font-family, Roboto, sans-serif)",
  },
});

export class List extends BaseElement {
  constructor() {
    super("ul");
    this.element.className = "m3-list " + listSva();
  }

  AddChild(child: BaseElement): this {
    this.element.appendChild(child.element);
    return this;
  }

  AddItem(item: BaseElement): this {
    return this.AddChild(item);
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
