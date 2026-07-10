import { InteractiveElement } from "../../../core/src/elements/interactive_element.ts";
import { IconElement } from "../../../core/src/elements/icon_element.ts";
import { LayoutElement } from "../../../core/src/elements/Layout.ts";
import { currentTheme } from "../theme.ts";

export class IconButton extends InteractiveElement {
  private icon: IconElement;

  constructor(icon: string) {
    super("button");
    this.element.className = "m3-icon-button";
    this.element.style.width = "40px";
    this.element.style.height = "40px";
    this.element.style.borderRadius = `${currentTheme.shapeCornerFull}px`;
    this.element.style.background = "transparent";
    this.element.style.color = currentTheme.onSurfaceVariant;
    this.element.style.border = "none";
    this.element.style.display = "inline-flex";
    this.element.style.alignItems = "center";
    this.element.style.justifyContent = "center";
    this.element.style.cursor = "pointer";
    this.element.style.fontFamily = currentTheme.fontFamily;

    this.icon = new IconElement(icon);
    this.icon.SetIconColor(currentTheme.onSurfaceVariant);
    this.element.appendChild(this.icon.element);

    this.SetStateLayerColor(currentTheme.onSurfaceVariant);
    this.SetFocusRingColor(currentTheme.primary);
  }

  /** Swaps the displayed icon glyph. */
  SetIcon(icon: string): this {
    this.icon.SetIcon(icon);
    return this;
  }

  SetOnClick(callback: (e: MouseEvent) => void): this {
    this.element.addEventListener("click", callback);
    return this;
  }

  override GetType(): string {
    return "IconButton";
  }
}

function CreateIconButton(icon: string): IconButton {
  return new IconButton(icon);
}

/**
 * AddIconButton function.
 * @param {LayoutElement} parent - The parent parameter
 * @param {string} icon - The icon parameter
 * @returns {IconButton}
 *
 */
export function AddIconButton(parent: LayoutElement, icon: string): IconButton {
  const btn = CreateIconButton(icon);
  parent.AddChild(btn);
  return btn;
}
