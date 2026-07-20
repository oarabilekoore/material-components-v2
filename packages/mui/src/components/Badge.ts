import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { BadgeVariant } from "../theme.ts";
import { sva } from "../../../core/src/utils/sva.ts";
import { LayoutElement, currentAutoBindTarget } from "../../../core/src/elements/Layout.ts";

const badgeSva = sva({
  base: {
    backgroundColor: "var(--md-error)",
    color: "var(--md-on-error)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--md-font-family, Roboto, sans-serif)",
  },
  variants: {
    variant: {
      small: {
        width: "6px",
        height: "6px",
        borderRadius: "3px",
        padding: "0",
        fontSize: "0",
      },
      large: {
        minWidth: "16px",
        height: "16px",
        borderRadius: "8px",
        padding: "0 4px",
        fontSize: "11px",
        fontWeight: "500",
      },
    },
  },
  defaultVariants: {
    variant: "small",
  },
});

export class BadgeEl extends BaseElement {
  private _variant: BadgeVariant;
  private _content: string;
  private _svaClass = "";

  constructor(variant: BadgeVariant = "small", content: string = "") {
    super("div");
    this._variant = variant;
    this._content = content;
    this.applyVariant(variant);
    this.SetContent(content);
  }

  private applyVariant(variant: BadgeVariant): void {
    if (this._svaClass) {
      this.element.classList.remove(this._svaClass);
    }
    this._svaClass = badgeSva({ variant });
    this.element.classList.add(this._svaClass);
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

function CreateBadge(
  variant: BadgeVariant = "small",
  content: string = "",
): BadgeEl {
  return new BadgeEl(variant, content);
}

/**
 * AddBadge function.
 * @param {HTMLElement} parent - The parent parameter
 * @param {BadgeVariant} variant - The variant parameter
 * @param {string} content - The content parameter
 * @returns {BadgeEl}
 *
 */
export function Badge(
  variant: BadgeVariant = "small",
  content: string = "", bindOptions?: { into?: import("../../../core/src/elements/Layout.ts").LayoutElement }
): BadgeEl {
  const badge = CreateBadge(variant, content);
  const parentTarget = bindOptions?.into ?? currentAutoBindTarget();
      if (parentTarget) parentTarget._internalMount(badge);
      else document.body.appendChild(badge.element);
  return badge;
}
