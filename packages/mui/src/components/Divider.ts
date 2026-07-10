import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { LayoutElement } from "../../../core/src/elements/Layout.ts";
import { sva } from "../../../core/src/utils/sva.ts";

const dividerSva = sva({
  base: {
    border: "none",
    height: "1px",
    margin: "0",
    width: "100%",
    backgroundColor: "var(--md-outline-variant)",
  },
});

export class Divider extends BaseElement {
  constructor() {
    super("hr");
    this.element.className = "m3-divider " + dividerSva();
  }

  override GetType(): string {
    return "Divider";
  }
}

function CreateDivider(): Divider {
  return new Divider();
}

/**
 * AddDivider function.
 * @param {LayoutElement} parent - The parent parameter
 * @returns {Divider}
 *
 */
export function AddDivider(parent: LayoutElement): Divider {
  const divider = CreateDivider();
  parent.AddChild(divider);
  return divider;
}
