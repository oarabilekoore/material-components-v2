import { Icon, SvgIconNode, Icons } from "../icons/Icon.ts";
import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { LayoutElement, currentAutoBindTarget } from "../../../core/src/elements/Layout.ts";
import { ChipVariant } from "../theme.ts";
import { sva } from "../../../core/src/utils/sva.ts";

import { attachRipple } from "../../../core/src/utils/ripple.ts";

const removeBtnSva = sva({
  base: {
    display: "inline-flex",
    marginLeft: "4px",
    cursor: "pointer",
  },
});

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

export class ChipEl extends BaseElement {
  private variant: ChipVariant;
  private selected = false;
  private labelSpan: HTMLSpanElement;
  private removeBtn?: HTMLSpanElement;
  private checkmarkIcon?: Icon;
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
      this.removeBtn.className = removeBtnSva();
      const icon = new Icon(Icons.close, 18);
      this.removeBtn.appendChild(icon.element);
      this.removeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.onRemove?.();
        this.element.remove();
      });
      this.element.appendChild(this.removeBtn);
    }

    if (variant === "filter") {
      this.checkmarkIcon = new Icon(Icons.check, 18);
      this.checkmarkIcon.element.style.display = "none";
      this.checkmarkIcon.element.style.marginRight = "-4px";
      this.element.insertBefore(this.checkmarkIcon.element, this.labelSpan);
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
    if (this.checkmarkIcon) {
      this.checkmarkIcon.element.style.display = this.selected ? "inline-flex" : "none";
    }
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
): ChipEl {
  return new ChipEl(label, variant);
}

/**
 * AddChip function.
 * @param {LayoutElement} parent - The parent parameter
 * @param {string} label - The label parameter
 * @param {ChipVariant} variant - The variant parameter
 * @returns {ChipEl}
 *
 */
export function Chip(
  label: string,
  variant: ChipVariant = "assist", bindOptions?: { into?: import("../../../core/src/elements/Layout.ts").LayoutElement }
): ChipEl {
  const chip = CreateChip(label, variant);
  const parentTarget = bindOptions?.into ?? currentAutoBindTarget();
      if (parentTarget) parentTarget._internalMount(chip);
      else document.body.appendChild(chip.element);
  return chip;
}
