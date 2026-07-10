import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { LayoutElement } from "../../../core/src/elements/Layout.ts";
import { CardVariant } from "../theme.ts";
import { sva } from "../../../core/src/utils/sva.ts";

const cardSva = sva({
  base: {
    fontFamily: "var(--md-font-family, Roboto, sans-serif)",
    borderRadius: "12px",
    padding: "16px",
    boxSizing: "border-box",
    transition: "background-color 0.2s ease, box-shadow 0.2s ease, border 0.2s ease",
  },
  variants: {
    variant: {
      elevated: {
        backgroundColor: "var(--md-surface)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        border: "none",
      },
      filled: {
        backgroundColor: "var(--md-surface-container, var(--md-surface-variant))",
        boxShadow: "none",
        border: "none",
      },
      outlined: {
        backgroundColor: "var(--md-surface)",
        border: "1px solid var(--md-outline-variant)",
        boxShadow: "none",
      },
    },
  },
  defaultVariants: {
    variant: "elevated",
  },
});

const headerSva = sva({
  base: {
    fontSize: "1.25rem",
    fontWeight: "500",
    marginBottom: "8px",
    color: "var(--md-on-surface)",
  },
});

const contentSva = sva({
  base: {
    fontSize: "0.875rem",
    color: "var(--md-on-surface-variant)",
  },
});

export class Card extends BaseElement {
  private headerEl: HTMLElement;
  private contentEl: HTMLElement;
  private _variant: CardVariant;
  private _svaClass = "";

  constructor(variant: CardVariant = "elevated") {
    super("div");
    this._variant = variant;
    this.applyVariant(variant);

    this.headerEl = document.createElement("div");
    this.headerEl.className = headerSva();
    this.element.appendChild(this.headerEl);

    this.contentEl = document.createElement("div");
    this.contentEl.className = contentSva();
    this.element.appendChild(this.contentEl);
  }

  private applyVariant(variant: CardVariant): void {
    if (this._svaClass) {
      this.element.classList.remove(this._svaClass);
    }
    this._svaClass = cardSva({ variant });
    this.element.classList.add(this._svaClass);
  }

  SetVariant(variant: CardVariant): this {
    this._variant = variant;
    this.applyVariant(variant);
    return this;
  }

  GetVariant(): CardVariant {
    return this._variant;
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

function CreateCard(variant: CardVariant = "elevated"): Card {
  return new Card(variant);
}

/**
 * AddCard function.
 * @param {LayoutElement} parent - The parent parameter
 * @param {CardVariant} variant - The variant parameter
 * @returns {Card}
 *
 */
export function AddCard(
  parent: LayoutElement,
  variant: CardVariant = "elevated",
): Card {
  const card = CreateCard(variant);
  parent.AddChild(card);
  return card;
}
