import { Icon, SvgIconNode, Icons } from "../icons/Icon.ts";
import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { LayoutElement, currentAutoBindTarget } from "../../../core/src/elements/Layout.ts";
import { sva } from "../../../core/src/utils/sva.ts";
import { attachRipple } from "../../../core/src/utils/ripple.ts";

const iconBtnSva = sva({
  base: {
    width: "40px",
    height: "40px",
    borderRadius: "9999px",
    background: "transparent",
    color: "var(--md-on-surface-variant)",
    border: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "background-color 0.2s ease, color 0.2s ease",
    fontFamily: "var(--md-font-family, Roboto, sans-serif)",
    outline: "none",
    "&:hover": {
      backgroundColor: "rgba(100, 100, 100, 0.08)",
    },
  },
});

export class IconButtonEl extends BaseElement {
  private _icon: Icon;

  constructor(iconNodes: SvgIconNode[] | string) {
    super("button");
    this.element.className = "m3-icon-button " + iconBtnSva();

    this._icon = new Icon(iconNodes, "medium");
    this.element.appendChild(this._icon.element);

    attachRipple(this.element);
  }

  SetOnClick(callback: (e: MouseEvent) => void): this {
    this.element.addEventListener("click", callback);
    return this;
  }

  SetIcon(iconNodes: SvgIconNode[] | string): this {
    this._icon.SetIcon(iconNodes);
    return this;
  }

  override GetType(): string {
    return "IconButton";
  }
}

function CreateIconButton(iconNodes: SvgIconNode[] | string): IconButtonEl {
  return new IconButtonEl(iconNodes);
}

/**
 * AddIconButton function.
 * @param {LayoutElement | BaseElement} parent - The parent parameter
 * @param {SvgIconNode[] | string} iconNodes - The icon nodes parameter
 * @returns {IconButtonEl}
 *
 */
export function IconButton(
  iconNodes: SvgIconNode[] | string, bindOptions?: { into?: import("../../../core/src/elements/Layout.ts").LayoutElement }
): IconButtonEl {
  const btn = CreateIconButton(iconNodes);
  const parentTarget = bindOptions?.into ?? currentAutoBindTarget();
      if (parentTarget) parentTarget._internalMount(btn);
      else document.body.appendChild(btn.element);
  return btn;
}
