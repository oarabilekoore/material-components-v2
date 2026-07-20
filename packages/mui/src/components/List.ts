import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { LayoutElement, currentAutoBindTarget } from "../../../core/src/elements/Layout.ts";
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

export class ListEl extends BaseElement {
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

function CreateList(): ListEl {
  return new ListEl();
}

/**
 * AddList function.
 * @param {LayoutElement} parent - The parent parameter
 * @returns {ListEl}
 *
 */
export function List(bindOptions?: { into?: import("../../../core/src/elements/Layout.ts").LayoutElement }): ListEl {
  const list = CreateList();
  const parentTarget = bindOptions?.into ?? currentAutoBindTarget();
      if (parentTarget) parentTarget._internalMount(list);
      else document.body.appendChild(list.element);
  return list;
}
