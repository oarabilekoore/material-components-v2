import { Icon, SvgIconNode, Icons } from "../icons/Icon.ts";
import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { LayoutElement } from "../../../core/src/elements/Layout.ts";
import { FabSize } from "../theme.ts";
import { sva } from "../../../core/src/utils/sva.ts";
import { attachRipple } from "../../../core/src/utils/ripple.ts";
import { Signal, CreateSignal, Bind } from "../../../core/src/state/signals.ts";

const extFabSva = sva({
  base: {
    backgroundColor: "var(--md-primary-container)",
    color: "var(--md-on-primary-container)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 6px 10px rgba(0,0,0,0.15)",
    transition:
      "box-shadow 0.2s ease, background-color 0.2s ease, padding 0.2s ease, width 0.2s ease",
    fontFamily: "var(--md-font-family, Roboto, sans-serif)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    "&:hover": {
      boxShadow: "0 8px 16px rgba(0,0,0,0.25)",
    },
  },
  variants: {
    size: {
      small: { height: "40px", borderRadius: "12px" },
      medium: { height: "56px", borderRadius: "16px" },
      large: { height: "96px", borderRadius: "28px" },
    },
    extended: {
      true: {},
      false: { padding: "0" },
    },
  },
  compoundVariants: [
    { size: "small", extended: true, style: { padding: "0 16px" } },
    { size: "small", extended: false, style: { width: "40px" } },
    { size: "medium", extended: true, style: { padding: "0 16px" } },
    { size: "medium", extended: false, style: { width: "56px" } },
    { size: "large", extended: true, style: { padding: "0 24px" } },
    { size: "large", extended: false, style: { width: "96px" } },
  ],
  defaultVariants: {
    size: "medium",
    extended: true,
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
        marginLeft: "12px",
      },
      false: {
        maxWidth: "0px",
        opacity: "0",
        marginLeft: "0px",
      },
    },
  },
});

export class ExtendedFab extends BaseElement {
  private _size: FabSize;
  private iconEl: HTMLElement;
  private labelEl: HTMLSpanElement;
  private _extended: Signal<boolean>;
  private _svaClass = "";
  private _collapseOnOutsideClick = false;

  constructor(
    iconNodes: SvgIconNode[] | string,
    label: string,
    size: FabSize = "medium",
  ) {
    super("button");
    this._size = size;

    this._extended = CreateSignal(true);
    this.applyVariant(true);

    const iconObj = new Icon(iconNodes, size);
    this.iconEl = iconObj.element;

    this.labelEl = document.createElement("span");
    this.labelEl.textContent = label;

    this.element.appendChild(this.iconEl);
    this.element.appendChild(this.labelEl);

    Bind(this._extended, (ext) => {
      this.labelEl.className = labelSva({ size: this._size, extended: ext });
      this.applyVariant(ext);
    });

    if (typeof document !== "undefined") {
      document.addEventListener("click", (e) => {
        if (
          this._collapseOnOutsideClick &&
          !this.element.contains(e.target as Node) &&
          this.IsExtended()
        ) {
          this.Shrink();
        }
      });
    }

    attachRipple(this.element);
  }

  private applyVariant(ext: boolean) {
    if (this._svaClass) {
      this.element.classList.remove(this._svaClass);
    }
    this._svaClass = extFabSva({ size: this._size, extended: ext });
    this.element.classList.add(this._svaClass);
  }

  Extend(): this {
    this._extended.Set(true);
    return this;
  }

  Shrink(): this {
    this._extended.Set(false);
    return this;
  }

  IsExtended(): boolean {
    return this._extended.Get();
  }

  SetCollapseOnOutsideClick(enable = true): this {
    this._collapseOnOutsideClick = enable;
    return this;
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
  iconNodes: SvgIconNode[] | string,
  label: string,
  size: FabSize = "medium",
): ExtendedFab {
  return new ExtendedFab(iconNodes, label, size);
}

/**
 * AddExtendedFab function.
 * @param {LayoutElement} parent - The parent parameter
 * @param {SvgIconNode[] | string} iconNodes - The icon nodes parameter
 * @param {string} label - The label parameter
 * @param {FabSize} size - The size parameter
 * @returns {ExtendedFab}
 *
 */
export function AddExtendedFab(
  parent: LayoutElement,
  iconNodes: SvgIconNode[] | string,
  label: string,
  size: FabSize = "medium",
): ExtendedFab {
  const fab = CreateExtendedFab(iconNodes, label, size);
  parent.AddChild(fab);
  return fab;
}
