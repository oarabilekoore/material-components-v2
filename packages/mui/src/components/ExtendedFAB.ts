import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { LayoutElement } from "../../../core/src/elements/Layout.ts";
import { FabSize } from "../theme.ts";
import { sva } from "../../../core/src/utils/sva.ts";
import { attachRipple } from "../../../core/src/utils/ripple.ts";

const extFabSva = sva({
  base: {
    backgroundColor: "var(--md-primary-container)",
    color: "var(--md-on-primary-container)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 6px 10px rgba(0,0,0,0.15)",
    transition: "box-shadow 0.2s ease, background-color 0.2s ease, padding 0.2s ease, width 0.2s ease",
    fontFamily: "var(--md-font-family, Roboto, sans-serif)",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
  variants: {
    size: {
      small: {
        height: "56px",
        padding: "0 16px",
        borderRadius: "12px",
      },
      medium: {
        height: "80px",
        padding: "0 26px",
        borderRadius: "16px",
      },
      large: {
        height: "96px",
        padding: "0 32px",
        borderRadius: "28px",
      },
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

const iconSva = sva({
  base: {
    flexShrink: "0",
  },
  variants: {
    size: {
      small: { fontSize: "24px" },
      medium: { fontSize: "28px" },
      large: { fontSize: "36px" },
    },
  },
});

const labelSva = sva({
  base: {
    fontWeight: "500",
    transition: "max-width 0.2s ease, opacity 0.15s ease, margin 0.2s ease",
    overflow: "hidden",
  },
  variants: {
    size: {
      small: { fontSize: "0.875rem" },
      medium: { fontSize: "1rem" },
      large: { fontSize: "1.15rem" },
    },
    extended: {
      true: {
        maxWidth: "300px",
        opacity: "1",
      },
      false: {
        maxWidth: "0px",
        opacity: "0",
      },
    },
  },
});

export class ExtendedFab extends BaseElement {
  private _size: FabSize;
  private iconEl: HTMLElement;
  private labelEl: HTMLSpanElement;
  private _extended = true;
  private _svaClass = "";

  constructor(icon: string, label: string, size: FabSize = "medium") {
    super("button");
    this._size = size;
    
    this.applyVariant();

    this.iconEl = document.createElement("span");
    this.iconEl.className = "material-icons " + iconSva({ size });
    this.iconEl.textContent = icon;

    this.labelEl = document.createElement("span");
    this.labelEl.textContent = label;

    this.element.appendChild(this.iconEl);
    this.element.appendChild(this.labelEl);
    
    this.updateLabelState();

    this.element.addEventListener("mouseenter", () => {
      this.element.style.boxShadow = "0 8px 16px rgba(0,0,0,0.25)";
    });
    this.element.addEventListener("mouseleave", () => {
      this.element.style.boxShadow = "0 6px 10px rgba(0,0,0,0.15)";
    });

    attachRipple(this.element);
  }

  private applyVariant() {
    if (this._svaClass) {
      this.element.classList.remove(this._svaClass);
    }
    this._svaClass = extFabSva({ size: this._size });
    this.element.classList.add(this._svaClass);
  }

  private updateLabelState() {
    this.labelEl.className = labelSva({ size: this._size, extended: this._extended });
  }

  Extend(): this {
    if (this._extended) return this;
    this._extended = true;
    this.updateLabelState();
    return this;
  }

  Shrink(): this {
    if (!this._extended) return this;
    this._extended = false;
    this.updateLabelState();
    return this;
  }

  IsExtended(): boolean {
    return this._extended;
  }

  SetOnClick(callback: (e: MouseEvent) => void): this {
    this.element.addEventListener("click", callback);
    return this;
  }

  override GetType(): string {
    return "ExtendedFab";
  }
}

function CreateExtendedFab(
  icon: string,
  label: string,
  size: FabSize = "medium",
): ExtendedFab {
  return new ExtendedFab(icon, label, size);
}

/**
 * AddExtendedFab function.
 * @param {LayoutElement} parent - The parent parameter
 * @param {string} icon - The icon parameter
 * @param {string} label - The label parameter
 * @param {FabSize} size - The size parameter
 * @returns {ExtendedFab}
 *
 */
export function AddExtendedFab(
  parent: LayoutElement,
  icon: string,
  label: string,
  size: FabSize = "medium",
): ExtendedFab {
  const fab = CreateExtendedFab(icon, label, size);
  parent.AddChild(fab);
  return fab;
}
