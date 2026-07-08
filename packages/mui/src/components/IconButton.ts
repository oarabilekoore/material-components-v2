import { BaseElement } from "../../../core/src/elements/base_element.ts";
import { LayoutElement } from "../../../core/src/elements/layout_element.ts";
import { currentTheme } from "../theme.ts";

export class IconButton extends BaseElement {
  private iconEl: HTMLElement;

  constructor(icon: string) {
    super("button");
    this.element.className = "m3-icon-button";
    this.element.style.cssText = `
      width: 40px;
      height: 40px;
      border-radius: ${currentTheme.shapeCornerFull}px;
      background: transparent;
      color: ${currentTheme.onSurfaceVariant};
      border: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color 0.2s ease, color 0.2s ease;
      font-family: var(--md-font-family, Roboto, sans-serif);
    `;

    this.iconEl = document.createElement("span");
    this.iconEl.className = "material-icons";
    this.iconEl.textContent = icon;
    this.iconEl.style.fontSize = "24px";
    this.element.appendChild(this.iconEl);

    this.element.addEventListener("mouseenter", () => {
      this.element.style.backgroundColor = `${currentTheme.onSurfaceVariant}14`;
    });
    this.element.addEventListener("mouseleave", () => {
      this.element.style.backgroundColor = "transparent";
    });
  }

  SetOnClick(callback: (e: MouseEvent) => void): this {
    this.element.addEventListener("click", callback);
    return this;
  }

  override GetType(): string {
    return "IconButton";
  }
}

export function CreateIconButton(icon: string): IconButton {
  return new IconButton(icon);
}

export function AddIconButton(parent: LayoutElement, icon: string): IconButton {
  const btn = CreateIconButton(icon);
  parent.AddChild(btn);
  return btn;
}
