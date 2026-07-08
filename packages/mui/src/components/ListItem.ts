import { BaseElement } from "../../../core/src/elements/base_element.ts";
import { currentTheme } from "../theme.ts";
import { List } from "./List.ts";

export class ListItem extends BaseElement {
  private _headline: HTMLSpanElement;
  private _supportingText: HTMLSpanElement | null = null;
  private _leadingContent: HTMLElement | null = null;
  private _trailingContent: HTMLElement | null = null;

  constructor(headline: string) {
    super("li");
    this.element.className = "m3-list-item";
    this.element.style.display = "flex";
    this.element.style.alignItems = "center";
    this.element.style.minHeight = "56px";
    this.element.style.padding = "8px 16px";
    this.element.style.boxSizing = "border-box";
    this.element.style.cursor = "pointer";
    this.element.style.transition = "background-color 0.2s ease";

    this.element.addEventListener("mouseenter", () => {
      this.element.style.backgroundColor = currentTheme.surfaceVariant;
    });
    this.element.addEventListener("mouseleave", () => {
      this.element.style.backgroundColor = "transparent";
    });

    const textContainer = document.createElement("div");
    textContainer.style.display = "flex";
    textContainer.style.flexDirection = "column";
    textContainer.style.flex = "1";
    textContainer.style.justifyContent = "center";

    this._headline = document.createElement("span");
    this._headline.textContent = headline;
    this._headline.style.fontSize = "1rem";
    this._headline.style.color = currentTheme.onSurface;
    textContainer.appendChild(this._headline);

    this.element.appendChild(textContainer);
  }

  SetSupportingText(text: string): this {
    if (!this._supportingText) {
      this._supportingText = document.createElement("span");
      this._supportingText.style.fontSize = "0.875rem";
      this._supportingText.style.color = currentTheme.onSurfaceVariant;
      const textContainer = this.element.querySelector("div");
      if (textContainer) textContainer.appendChild(this._supportingText);
    }
    this._supportingText.textContent = text;
    this.element.style.minHeight = "72px";
    return this;
  }

  SetLeadingIcon(icon: string): this {
    if (!this._leadingContent) {
      this._leadingContent = document.createElement("span");
      this._leadingContent.style.marginRight = "16px";
      this._leadingContent.style.display = "flex";
      this._leadingContent.style.alignItems = "center";
      this._leadingContent.style.justifyContent = "center";
      this._leadingContent.style.width = "24px";
      this._leadingContent.style.height = "24px";
      this._leadingContent.style.color = currentTheme.onSurfaceVariant;
      this.element.insertBefore(this._leadingContent, this.element.firstChild);
    }
    this._leadingContent.textContent = icon;
    return this;
  }

  SetTrailingContent(element: BaseElement): this {
    if (this._trailingContent) {
      this._trailingContent.remove();
    }
    this._trailingContent = document.createElement("div");
    this._trailingContent.style.marginLeft = "16px";
    this._trailingContent.appendChild(element.element);
    this.element.appendChild(this._trailingContent);
    return this;
  }

  SetOnClick(callback: (event: MouseEvent) => void): this {
    this.element.addEventListener("click", callback);
    return this;
  }

  override GetType(): string {
    return "ListItem";
  }
}

export function CreateListItem(headline: string): ListItem {
  return new ListItem(headline);
}

export function AddListItem(parent: List, headline: string): ListItem {
  const item = CreateListItem(headline);
  parent.element.appendChild(item.element);
  return item;
}
