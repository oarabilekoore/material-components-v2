import { BaseElement } from "../../../core/src/elements/base_element.ts";
import { LayoutElement } from "../../../core/src/elements/layout_element.ts";
import { currentTheme } from "../theme.ts";

export class Divider extends BaseElement {
  constructor() {
    super("hr");
    this.element.className = "m3-divider";
    this.element.style.border = "none";
    this.element.style.height = "1px";
    this.element.style.margin = "0";
    this.element.style.width = "100%";
    this.element.style.backgroundColor = currentTheme.outlineVariant;
  }

  override GetType(): string {
    return "Divider";
  }
}

export function CreateDivider(): Divider {
  return new Divider();
}

export function AddDivider(parent: LayoutElement): Divider {
  const divider = CreateDivider();
  parent.AddChild(divider);
  return divider;
}
