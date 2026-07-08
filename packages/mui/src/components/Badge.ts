import { BaseElement } from "../../../core/src/elements/base_element.ts";
import { LayoutElement } from "../../../core/src/elements/layout_element.ts";
import { BadgeVariant, currentTheme } from "../theme.ts";

export class Badge extends BaseElement {
  private _variant: BadgeVariant;
  private _content: string;

  constructor(variant: BadgeVariant = "small", content: string = "") {
    super("div");
    this._variant = variant;
    this._content = content;
    this.element.className = "m3-badge";
    this.element.style.backgroundColor = currentTheme.error;
    this.element.style.color = currentTheme.onError;
    this.element.style.display = "inline-flex";
    this.element.style.alignItems = "center";
    this.element.style.justifyContent = "center";
    this.element.style.fontFamily = currentTheme.fontFamily;
    this.applyVariant(variant);
    this.SetContent(content);
  }

  private applyVariant(variant: BadgeVariant): void {
    if (variant === "small") {
      this.element.style.width = "6px";
      this.element.style.height = "6px";
      this.element.style.borderRadius = "3px";
      this.element.style.padding = "0";
      this.element.style.fontSize = "0";
    } else {
      this.element.style.minWidth = "16px";
      this.element.style.height = "16px";
      this.element.style.borderRadius = "8px";
      this.element.style.padding = "0 4px";
      this.element.style.fontSize = "11px";
      this.element.style.fontWeight = "500";
    }
  }

  SetContent(content: string): this {
    this._content = content;
    if (this._variant === "large") {
      this.element.textContent =
        this._content.length > 3 ? "99+" : this._content;
    }
    return this;
  }

  override GetType(): string {
    return "Badge";
  }
}

export function CreateBadge(
  variant: BadgeVariant = "small",
  content: string = "",
): Badge {
  return new Badge(variant, content);
}

export function AddBadge(
  parent: HTMLElement,
  variant: BadgeVariant = "small",
  content: string = "",
): Badge {
  const badge = CreateBadge(variant, content);
  parent.appendChild(badge.element);
  return badge;
}
