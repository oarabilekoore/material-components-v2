import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { LayoutElement } from "../../../core/src/elements/Layout.ts";
import { FabSize } from "../theme.ts";
import { sva } from "../../../core/src/utils/sva.ts";
import { attachRipple } from "../../../core/src/utils/ripple.ts";

const fabSva = sva({
  base: {
    backgroundColor: "var(--md-primary-container)",
    color: "var(--md-on-primary-container)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 6px 10px rgba(0,0,0,0.15)",
    transition: "box-shadow 0.2s ease, background-color 0.2s ease",
    fontFamily: "var(--md-font-family, Roboto, sans-serif)",
  },
  variants: {
    size: {
      small: {
        width: "40px",
        height: "40px",
        borderRadius: "12px",
      },
      medium: {
        width: "56px",
        height: "56px",
        borderRadius: "16px",
      },
      large: {
        width: "96px",
        height: "96px",
        borderRadius: "28px",
      },
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

const iconSva = sva({
  base: {},
  variants: {
    size: {
      small: { fontSize: "24px" },
      medium: { fontSize: "24px" },
      large: { fontSize: "36px" },
    },
  },
});

export class Fab extends BaseElement {
  private _size: FabSize;
  private iconEl: HTMLElement;
  private _svaClass = "";

  constructor(icon: string, size: FabSize = "medium") {
    super("button");
    this._size = size;
    
    this.applyVariant(size);

    this.iconEl = document.createElement("span");
    this.iconEl.className = "material-icons " + iconSva({ size });
    this.iconEl.textContent = icon;
    this.element.appendChild(this.iconEl);

    this.element.addEventListener("mouseenter", () => {
      this.element.style.boxShadow = "0 8px 16px rgba(0,0,0,0.25)";
    });
    this.element.addEventListener("mouseleave", () => {
      this.element.style.boxShadow = "0 6px 10px rgba(0,0,0,0.15)";
    });

    attachRipple(this.element);
  }

  private applyVariant(size: FabSize) {
    if (this._svaClass) {
      this.element.classList.remove(this._svaClass);
    }
    this._svaClass = fabSva({ size });
    this.element.classList.add(this._svaClass);
  }

  SetIcon(icon: string): this {
    this.iconEl.textContent = icon;
    return this;
  }

  SetOnClick(callback: (e: MouseEvent) => void): this {
    this.element.addEventListener("click", callback);
    return this;
  }

  override GetType(): string {
    return "Fab";
  }
}

function CreateFab(icon: string, size: FabSize = "medium"): Fab {
  return new Fab(icon, size);
}

/**
 * AddFab function.
 * @param {LayoutElement} parent - The parent parameter
 * @param {string} icon - The icon parameter
 * @param {FabSize} size - The size parameter
 * @returns {Fab}
 *
 */
export function AddFab(
  parent: LayoutElement,
  icon: string,
  size: FabSize = "medium",
): Fab {
  const fab = CreateFab(icon, size);
  parent.AddChild(fab);
  return fab;
}
