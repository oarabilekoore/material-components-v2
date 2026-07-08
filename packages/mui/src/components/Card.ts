import { BaseElement } from "../../../core/src/elements/base_element.ts";
import { LayoutElement } from "../../../core/src/elements/layout_element.ts";
import { CardVariant, currentTheme } from "../theme.ts";

export class Card extends BaseElement {
  private headerEl: HTMLElement;
  private contentEl: HTMLElement;
  private _variant: CardVariant;

  constructor(variant: CardVariant = "elevated") {
    super("div");
    this._variant = variant;
    this.element.className = `m3-card m3-card-${variant}`;
    this.element.style.fontFamily = currentTheme.fontFamily;
    this.element.style.borderRadius = `${currentTheme.shapeCornerMedium}px`;
    this.element.style.padding = "16px";
    this.element.style.boxSizing = "border-box";
    this.element.style.transition =
      "background-color 0.2s ease, box-shadow 0.2s ease";

    this.applyVariant(variant);

    this.headerEl = document.createElement("div");
    this.headerEl.style.fontSize = "1.25rem";
    this.headerEl.style.fontWeight = "500";
    this.headerEl.style.marginBottom = "8px";
    this.headerEl.style.color = currentTheme.onSurface;
    this.element.appendChild(this.headerEl);

    this.contentEl = document.createElement("div");
    this.contentEl.style.fontSize = "0.875rem";
    this.contentEl.style.color = currentTheme.onSurfaceVariant;
    this.element.appendChild(this.contentEl);
  }

  private applyVariant(variant: CardVariant): void {
    switch (variant) {
      case "elevated":
        this.element.style.backgroundColor = currentTheme.surface;
        this.element.style.boxShadow = `0 ${currentTheme.elevationLevel1}px ${currentTheme.elevationLevel2}px rgba(0,0,0,0.1)`;
        break;
      case "filled":
        this.element.style.backgroundColor =
          currentTheme.surfaceContainer || currentTheme.surfaceVariant;
        break;
      case "outlined":
        this.element.style.backgroundColor = currentTheme.surface;
        this.element.style.border = `1px solid ${currentTheme.outlineVariant}`;
        break;
    }
  }

  SetHeader(text: string): this {
    this.headerEl.textContent = text;
    return this;
  }

  SetContent(text: string): this {
    this.contentEl.textContent = text;
    return this;
  }

  SetOnClick(callback: (e: MouseEvent) => void): this {
    this.element.style.cursor = "pointer";
    this.element.addEventListener("click", callback);
    return this;
  }

  override GetType(): string {
    return "Card";
  }
}

export function CreateCard(variant: CardVariant = "elevated"): Card {
  return new Card(variant);
}

export function AddCard(
  parent: LayoutElement,
  variant: CardVariant = "elevated",
): Card {
  const card = CreateCard(variant);
  parent.AddChild(card);
  return card;
}
