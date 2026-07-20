import { Icon, SvgIconNode, Icons } from "../icons/Icon.ts";
import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { LayoutElement, currentAutoBindTarget } from "../../../core/src/elements/Layout.ts";
import { sva } from "../../../core/src/utils/sva.ts";
import { attachRipple } from "../../../core/src/utils/ripple.ts";
import { ButtonVariant } from "../theme.ts";

const containerSva = sva({
  base: {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: "20px",
    overflow: "hidden",
    fontFamily: "var(--md-font-family, Roboto, sans-serif)",
    transition: "box-shadow 0.2s ease, background-color 0.2s ease",
  },
  variants: {
    variant: {
      filled: {
        backgroundColor: "var(--md-primary)",
        color: "var(--md-on-primary)",
      },
      outlined: {
        backgroundColor: "transparent",
        color: "var(--md-primary)",
        border: "1px solid var(--md-outline)",
      },
      tonal: {
        backgroundColor: "var(--md-secondary-container)",
        color: "var(--md-on-secondary-container)",
      },
      elevated: {
        backgroundColor: "var(--md-surface-container-low, var(--md-surface))",
        color: "var(--md-primary)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
      },
      text: {
        backgroundColor: "transparent",
        color: "var(--md-primary)",
      }
    }
  },
  defaultVariants: {
    variant: "filled"
  }
});

const primaryActionSva = sva({
  base: {
    padding: "0 16px",
    height: "40px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    border: "none",
    background: "transparent",
    color: "inherit",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    outline: "none",
  }
});

const secondaryActionSva = sva({
  base: {
    padding: "0 12px",
    height: "40px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    background: "transparent",
    color: "inherit",
    cursor: "pointer",
    borderLeft: "1px solid var(--md-outline-variant)", // divider
    outline: "none",
  },
  variants: {
    variant: {
      filled: { borderLeftColor: "rgba(0, 0, 0, 0.12)" },
      outlined: {},
      tonal: {},
      elevated: { borderLeftColor: "rgba(0, 0, 0, 0.12)" },
      text: {},
      "filled-tonal": { borderLeftColor: "rgba(0, 0, 0, 0.12)" },
    }
  },
  defaultVariants: {
    variant: "filled"
  }
});

export class SplitButtonEl extends BaseElement {
  private _primaryBtn: HTMLButtonElement;
  private _secondaryBtn: HTMLButtonElement;
  private _iconSpan?: Icon;

  constructor(label: string, variant: ButtonVariant = "filled", iconNodes?: SvgIconNode[] | string) {
    super("div");
    this.element.className = "m3-split-button " + containerSva({ variant });

    this._primaryBtn = document.createElement("button");
    this._primaryBtn.className = primaryActionSva();

    if (iconNodes) {
      this._iconSpan = new Icon(iconNodes);
      this._iconSpan.SetIconSize(18);
      this._primaryBtn.appendChild(this._iconSpan.element);
    }

    const labelSpan = document.createElement("span");
    labelSpan.textContent = label;
    this._primaryBtn.appendChild(labelSpan);

    this._secondaryBtn = document.createElement("button");
    this._secondaryBtn.className = secondaryActionSva({ variant });
    const dropIcon = new Icon(Icons.menu);
    this._secondaryBtn.appendChild(dropIcon.element);

    attachRipple(this._primaryBtn);
    attachRipple(this._secondaryBtn);

    this.element.appendChild(this._primaryBtn);
    this.element.appendChild(this._secondaryBtn);
  }

  SetOnPrimaryClick(callback: () => void): this {
    this._primaryBtn.addEventListener("click", callback);
    return this;
  }

  SetOnSecondaryClick(callback: () => void): this {
    this._secondaryBtn.addEventListener("click", callback);
    return this;
  }

  override GetType(): string {
    return "SplitButton";
  }
}

function CreateSplitButton(label: string, variant: ButtonVariant = "filled", iconNodes?: SvgIconNode[] | string): SplitButtonEl {
  return new SplitButtonEl(label, variant, iconNodes);
}

/**
 * AddSplitButton function.
 * @param {LayoutElement} parent - The parent parameter
 * @param {string} label - The label parameter
 * @param {ButtonVariant} variant - The variant parameter
 * @param {string} icon - The icon parameter
 * @returns {SplitButtonEl}
 *
 */
export function SplitButton(label: string, variant: ButtonVariant = "filled", iconNodes?: SvgIconNode[] | string, bindOptions?: { into?: import("../../../core/src/elements/Layout.ts").LayoutElement }): SplitButtonEl {
  const btn = CreateSplitButton(label, variant, iconNodes);
  const parentTarget = bindOptions?.into ?? currentAutoBindTarget();
      if (parentTarget) parentTarget._internalMount(btn);
      else document.body.appendChild(btn.element);
  return btn;
}
