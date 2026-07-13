import { Icon, SvgIconNode, Icons } from "../icons/Icon.ts";
import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { LayoutElement } from "../../../core/src/elements/Layout.ts";
import { ButtonVariant } from "../theme.ts";
import { sva } from "../../../core/src/utils/sva.ts";

import { attachRipple } from "../../../core/src/utils/ripple.ts";

const buttonSva = sva({
  base: {
    fontFamily: "var(--md-font-family, Roboto, sans-serif)",
    fontSize: "0.875rem",
    fontWeight: "500",
    borderRadius: "9999px",
    padding: "10px 24px",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    border: "none",
    outline: "none",
    transition: "background-color 0.2s ease, box-shadow 0.2s ease, color 0.2s ease",
  },
  variants: {
    variant: {
      elevated: {
        backgroundColor: "var(--md-surface-container, var(--md-surface))",
        color: "var(--md-primary)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
        "&:hover": {
          backgroundColor: "var(--md-primary)",
          color: "var(--md-on-primary)",
        }
      },
      filled: {
        backgroundColor: "var(--md-primary)",
        color: "var(--md-on-primary)",
        "&:hover": {
          boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
          opacity: "0.9",
        }
      },
      "filled-tonal": {
        backgroundColor: "var(--md-secondary-container)",
        color: "var(--md-on-secondary-container)",
        "&:hover": {
          backgroundColor: "var(--md-secondary)",
          color: "var(--md-on-secondary)",
        }
      },
      outlined: {
        backgroundColor: "transparent",
        color: "var(--md-primary)",
        border: "1px solid var(--md-outline)",
        "&:hover": {
          backgroundColor: "var(--md-surface-variant)",
        }
      },
      text: {
        backgroundColor: "transparent",
        color: "var(--md-primary)",
        "&:hover": {
          backgroundColor: "var(--md-surface-variant)",
        }
      },
    },
  },
  defaultVariants: {
    variant: "filled",
  },
});

export class Button extends BaseElement {
  private _variant: ButtonVariant;
  private _svaClass = "";

  constructor(
    text: string,
    variant: ButtonVariant = "filled",
    iconNodes?: SvgIconNode[] | string,
  ) {
    super("button");
    this._variant = variant;
    
    if (iconNodes) {
      const iconSpan = new Icon(iconNodes);
      iconSpan.SetIconSize(18);
      this.element.appendChild(iconSpan.element);
    }

    const textSpan = document.createElement("span");
    textSpan.textContent = text;
    this.element.appendChild(textSpan);

    this.applyVariant(variant);
    attachRipple(this.element);
  }

  private applyVariant(variant: ButtonVariant): void {
    if (this._svaClass) {
      this.element.classList.remove(this._svaClass);
    }
    this._svaClass = buttonSva({ variant });
    this.element.classList.add(this._svaClass);
  }

  SetVariant(variant: ButtonVariant): this {
    this._variant = variant;
    this.applyVariant(variant);
    return this;
  }

  GetVariant(): ButtonVariant {
    return this._variant;
  }

  SetText(text: string): this {
    const textSpan = this.element.querySelector('span');
    if (textSpan) textSpan.textContent = text;
    return this;
  }

  SetOnClick(callback: (e: MouseEvent) => void): this {
    this.element.addEventListener("click", callback);
    return this;
  }

  override GetType(): string {
    return "Button";
  }
}

function CreateButton(
  text: string,
  variant: ButtonVariant = "filled",
  iconNodes?: SvgIconNode[] | string,
): Button {
  return new Button(text, variant, iconNodes);
}

/**
 * AddButton function.
 * @param {LayoutElement} parent - The parent parameter
 * @param {string} text - The text parameter
 * @param {ButtonVariant} variant - The variant parameter
 * @param {string} options - The options parameter
 * @returns {Button}
 *
 */
export function AddButton(
  parent: LayoutElement,
  text: string,
  variant: ButtonVariant = "filled",
  iconNodes?: SvgIconNode[] | string,
): Button {
  const btn = CreateButton(text, variant, iconNodes);
  parent.AddChild(btn);
  return btn;
}
