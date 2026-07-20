import { Icon, SvgIconNode, Icons } from "../icons/Icon.ts";
import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { LayoutElement, currentAutoBindTarget } from "../../../core/src/elements/Layout.ts";
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
    "&:hover": {
      boxShadow: "0 8px 16px rgba(0,0,0,0.25)",
    },
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

export class FabEl extends BaseElement {
  private _size: FabSize;
  private _icon: Icon;
  private _svaClass = "";

  constructor(iconNodes: SvgIconNode[] | string, size: FabSize = "medium") {
    super("button");
    this._size = size;
    
    this.applyVariant(size);

    this._icon = new Icon(iconNodes, size);
    this.element.appendChild(this._icon.element);

    attachRipple(this.element);
  }

  private applyVariant(size: FabSize) {
    if (this._svaClass) {
      this.element.classList.remove(this._svaClass);
    }
    this._svaClass = fabSva({ size });
    this.element.classList.add(this._svaClass);
  }

  SetIcon(iconNodes: SvgIconNode[] | string): this {
    this._icon.SetIcon(iconNodes);
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

function CreateFab(iconNodes: SvgIconNode[] | string, size: FabSize = "medium"): FabEl {
  return new FabEl(iconNodes, size);
}

/**
 * AddFab function.
 * @param {LayoutElement} parent - The parent parameter
 * @param {string} icon - The icon parameter
 * @param {FabSize} size - The size parameter
 * @returns {FabEl}
 *
 */
export function Fab(
  iconNodes: SvgIconNode[] | string,
  size: FabSize = "medium", bindOptions?: { into?: import("../../../core/src/elements/Layout.ts").LayoutElement }
): FabEl {
  const fab = CreateFab(iconNodes, size);
  const parentTarget = bindOptions?.into ?? currentAutoBindTarget();
      if (parentTarget) parentTarget._internalMount(fab);
      else document.body.appendChild(fab.element);
  return fab;
}
