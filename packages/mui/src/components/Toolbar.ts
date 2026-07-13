import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { LayoutElement } from "../../../core/src/elements/Layout.ts";
import { sva } from "../../../core/src/utils/sva.ts";

const toolbarSva = sva({
  base: {
    display: "flex",
    alignItems: "center",
    padding: "8px 16px",
    gap: "8px",
    backgroundColor: "var(--md-surface)",
    color: "var(--md-on-surface)",
    boxSizing: "border-box",
    minHeight: "64px",
    width: "100%",
  },
});

export class Toolbar extends BaseElement {
  constructor() {
    super("div");
    this.element.className = "m3-toolbar " + toolbarSva();
  }

  AddChild(child: BaseElement): this {
    this.element.appendChild(child.element);
    return this;
  }

  override GetType(): string {
    return "Toolbar";
  }
}

export function CreateToolbar(): Toolbar {
  return new Toolbar();
}

export function AddToolbar(parent: LayoutElement): Toolbar {
  const toolbar = CreateToolbar();
  parent.AddChild(toolbar);
  return toolbar;
}
