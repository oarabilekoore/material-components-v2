import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { LayoutElement } from "../../../core/src/elements/Layout.ts";
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
  },
});

export class IconButton extends BaseElement {
  private iconEl: HTMLElement;

  constructor(icon: string) {
    super("button");
    this.element.className = "m3-icon-button " + iconBtnSva();

    this.iconEl = document.createElement("span");
    this.iconEl.className = "material-icons";
    this.iconEl.textContent = icon;
    this.iconEl.style.fontSize = "24px";
    this.element.appendChild(this.iconEl);

    this.element.addEventListener("mouseenter", () => {
      this.element.style.backgroundColor = "rgba(100, 100, 100, 0.08)";
    });
    this.element.addEventListener("mouseleave", () => {
      this.element.style.backgroundColor = "transparent";
    });
    attachRipple(this.element);
  }

  SetOnClick(callback: (e: MouseEvent) => void): this {
    this.element.addEventListener("click", callback);
    return this;
  }

  override GetType(): string {
    return "IconButton";
  }
}

function CreateIconButton(icon: string): IconButton {
  return new IconButton(icon);
}

/**
 * AddIconButton function.
 * @param {LayoutElement | BaseElement} parent - The parent parameter
 * @param {string} icon - The icon parameter
 * @returns {IconButton}
 *
 */
export function AddIconButton(
  parent: LayoutElement | BaseElement,
  icon: string,
): IconButton {
  const btn = CreateIconButton(icon);
  if ("AddChild" in parent && typeof (parent as any).AddChild === "function") {
    (parent as any).AddChild(btn);
  } else {
    parent.element.appendChild(btn.element);
  }
  return btn;
}
