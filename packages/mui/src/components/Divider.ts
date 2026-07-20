import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { LayoutElement, currentAutoBindTarget } from "../../../core/src/elements/Layout.ts";
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

export class DividerEl extends BaseElement {
  constructor() {
    super("hr");
    this.element.className = "m3-divider " + dividerSva();
  }

  override GetType(): string {
    return "Divider";
  }
}

function CreateDivider(): DividerEl {
  return new DividerEl();
}

/**
 * AddDivider function.
 * @param {LayoutElement} parent - The parent parameter
 * @returns {DividerEl}
 *
 */
export function Divider(bindOptions?: { into?: import("../../../core/src/elements/Layout.ts").LayoutElement }): DividerEl {
  const divider = CreateDivider();
  const parentTarget = bindOptions?.into ?? currentAutoBindTarget();
      if (parentTarget) parentTarget._internalMount(divider);
      else document.body.appendChild(divider.element);
  return divider;
}
