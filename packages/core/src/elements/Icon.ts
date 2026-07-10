import { BaseElement } from "./BaseElement.ts";

export type IconFont =
  | "material-icons"
  | "material-icons-outlined"
  | "material-icons-round"
  | "material-symbols-outlined"
  | "material-symbols-rounded";

/** A single icon-font glyph. Every mui component that shows a Material icon
 * (IconButton, Fab, Chip, Dialog, Menu, ...) should build it from here
 * instead of hand-rolling a `<span class="material-icons">`. */
export class IconElement extends BaseElement {
  constructor(name: string, font: IconFont = "material-icons") {
    super("span");
    this.element.className = font;
    this.element.textContent = name;
    this.element.style.fontSize = "24px";
    this.element.style.lineHeight = "1";
    this.element.style.userSelect = "none";
    this.element.style.display = "inline-block";
  }

  /** Swaps the glyph. */
  SetIcon(name: string): this {
    this.element.textContent = name;
    return this;
  }

  SetIconSize(px: number): this {
    this.element.style.fontSize = `${px}px`;
    return this;
  }

  SetIconColor(color: string): this {
    this.element.style.color = color;
    return this;
  }

  override GetType(): string {
    return "Icon";
  }
}

function CreateIcon(name: string, font: IconFont = "material-icons"): IconElement {
  return new IconElement(name, font);
}
