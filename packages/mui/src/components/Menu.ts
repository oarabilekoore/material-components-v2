import { Icon, SvgIconNode, Icons } from "../icons/Icon.ts";
import { OverlayElement } from "../../../core/src/elements/Overlay.ts";
import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { currentTheme } from "../theme.ts";
import { sva } from "../../../core/src/utils/sva.ts";

const menuSva = sva({
  base: {
    position: "absolute",
    backgroundColor: "var(--md-surface)",
    borderRadius: "calc(var(--md-shape-corner-extra-small) * var(--md-shape-scale, 1))",
    boxShadow: "0 3px 6px rgba(0,0,0,0.2)",
    padding: "8px 0",
    minWidth: "112px",
    maxWidth: "280px",
    fontFamily: "var(--md-font-family, Roboto, sans-serif)",
    zIndex: 2000,
    flexDirection: "column",
  },
  variants: {
    open: {
      true: { display: "flex" },
      false: { display: "none" }
    }
  },
  defaultVariants: { open: false }
});

const menuIconSva = sva({
  base: {
    marginRight: "12px",
  }
});

const menuItemSva = sva({
  base: {
    display: "flex",
    alignItems: "center",
    padding: "0 12px",
    minHeight: "48px",
    cursor: "pointer",
    color: "var(--md-on-surface)",
    fontSize: "14px",
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: "var(--md-surface-variant)",
    },
  },
});

export class MenuEl extends OverlayElement {
  private _items: HTMLDivElement[] = [];

  constructor() {
    super("div", { scrim: false, dismissOnOutsideClick: true, dismissOnEscape: true });
    this.element.className = "m3-menu " + menuSva({ open: false });
    
    import("../../../core/src/state/signals.ts").then(({ Bind }) => {
      Bind(this.GetIsOpenSignal(), (isOpen) => {
        this.element.className = "m3-menu " + menuSva({ open: isOpen });
      });
    });
  }

  SetAnchor(target: BaseElement): this {
    const anchorName = `--menu-anchor-${Math.random().toString(36).substring(2, 8)}`;
    target.element.style.setProperty("anchor-name", anchorName);
    this.element.style.setProperty("position-anchor", anchorName);
    this.element.style.setProperty("position-area", "block-end span-inline-start");
    this.element.style.setProperty("position-try-fallbacks", "flip-block, flip-inline");
    this.element.style.inset = "auto";
    this.element.style.margin = "0";
    return this;
  }

  AddItem(label: string, callback: () => void, iconNodes?: SvgIconNode[] | string): this {
    const item = document.createElement("div");
    item.className = menuItemSva();

    if (iconNodes) {
      const iconObj = new Icon(iconNodes);
      iconObj.element.className = menuIconSva();
      item.appendChild(iconObj.element);
    }

    const labelSpan = document.createElement("span");
    labelSpan.textContent = label;
    item.appendChild(labelSpan);
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      callback();
      this.Close();
    });

    this._items.push(item);
    this.element.appendChild(item);
    return this;
  }



  override GetType(): string {
    return "Menu";
  }
}

function CreateMenu(): MenuEl {
  return new MenuEl();
}

/**
 * AddMenu function.
 * @param {import("../../../core/src/elements/Layout.ts").LayoutElement} parent - The parent parameter
 * @returns {MenuEl}
 */
export function Menu(
): MenuEl {
  const menu = CreateMenu();
  return menu;
}
