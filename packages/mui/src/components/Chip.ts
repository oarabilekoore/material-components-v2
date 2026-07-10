import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { LayoutElement } from "../../../core/src/elements/Layout.ts";
import { ChipVariant } from "../theme.ts";
import { sva } from "../../../core/src/utils/sva.ts";

import { attachRipple } from "../../../core/src/utils/ripple.ts";

const chipSva = sva({
  base: {
    display: "inline-flex",
    alignItems: "center",
    height: "32px",
    borderRadius: "8px",
    padding: "0 16px",
    gap: "8px",
    cursor: "pointer",
    fontFamily: "var(--md-font-family, Roboto, sans-serif)",
    fontSize: "14px",
    boxSizing: "border-box",
    userSelect: "none",
    transition: "background-color 0.1s ease, border-color 0.1s ease",
  },
  variants: {
    selected: {
      true: {
        backgroundColor: "var(--md-secondary-container)",
        border: "none",
        color: "var(--md-on-secondary-container)",
      },
      false: {
        backgroundColor: "transparent",
        border: "1px solid var(--md-outline)",
        color: "var(--md-on-surface-variant)",
      },
    },
  },
  defaultVariants: {
    selected: false,
  },
});

export class Chip extends BaseElement {
  private variant: ChipVariant;
  private selected = false;
  private labelSpan: HTMLSpanElement;
  private removeBtn?: HTMLSpanElement;
  private onRemove?: () => void;
  private onSelect?: (selected: boolean) => void;
  private _svaClass = "";

  constructor(label: string, variant: ChipVariant = "assist") {
    super("div");
    this.variant = variant;
    
    this.labelSpan = document.createElement("span");
    this.labelSpan.textContent = label;
    this.element.appendChild(this.labelSpan);

    if (variant === "input") {
      this.removeBtn = document.createElement("span");
      this.removeBtn.className = "material-icons";
      this.removeBtn.textContent = "close";
      this.removeBtn.style.fontSize = "18px";
      this.removeBtn.style.marginLeft = "4px";
      this.removeBtn.style.cursor = "pointer";
      this.removeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.onRemove?.();
        this.element.remove();
      });
      this.element.appendChild(this.removeBtn);
    }

    this.element.addEventListener("click", () => {
      if (variant === "filter") {
        this.selected = !this.selected;
        this.onSelect?.(this.selected);
      }
      this.updateStyle();
    });

    this.updateStyle();
    attachRipple(this.element);
  }

  private updateStyle() {
    if (this._svaClass) {
      this.element.classList.remove(this._svaClass);
    }
    this._svaClass = chipSva({ selected: this.selected });
    this.element.classList.add(this._svaClass);
  }

  SetSelected(selected: boolean): this {
    this.selected = selected;
    this.updateStyle();
    return this;
  }

  IsSelected(): boolean {
    return this.selected;
  }

  SetOnSelect(callback: (selected: boolean) => void): this {
    this.onSelect = callback;
    return this;
  }

  SetOnRemove(callback: () => void): this {
    this.onRemove = callback;
    return this;
  }

  SetOnClick(callback: () => void): this {
    this.element.addEventListener("click", callback);
    return this;
  }

  override GetType(): string {
    return "Chip";
  }
}

function CreateChip(
  label: string,
  variant: ChipVariant = "assist",
): Chip {
  return new Chip(label, variant);
}

/**
 * AddChip function.
 * @param {LayoutElement} parent - The parent parameter
 * @param {string} label - The label parameter
 * @param {ChipVariant} variant - The variant parameter
 * @returns {Chip}
 *
 */
export function AddChip(
  parent: LayoutElement,
  label: string,
  variant: ChipVariant = "assist",
): Chip {
  const chip = CreateChip(label, variant);
  parent.AddChild(chip);
  return chip;
}
