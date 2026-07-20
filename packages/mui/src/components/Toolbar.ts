import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { LayoutElement, currentAutoBindTarget } from "../../../core/src/elements/Layout.ts";
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

export class ToolbarEl extends BaseElement {
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

export function CreateToolbar(): ToolbarEl {
  return new ToolbarEl();
}

export function Toolbar(bindOptions?: { into?: import("../../../core/src/elements/Layout.ts").LayoutElement }): ToolbarEl {
  const toolbar = CreateToolbar();
  const parentTarget = bindOptions?.into ?? currentAutoBindTarget();
      if (parentTarget) parentTarget._internalMount(toolbar);
      else document.body.appendChild(toolbar.element);
  return toolbar;
}
