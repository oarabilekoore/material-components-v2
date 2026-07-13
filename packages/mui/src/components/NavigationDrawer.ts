import { Icon, SvgIconNode, Icons } from "../icons/Icon.ts";
import { OverlayElement } from "../../../core/src/elements/Overlay.ts";
import { DrawerVariant, currentTheme } from "../theme.ts";
import { sva } from "../../../core/src/utils/sva.ts";

// scrimSva removed because OverlayElement provides it

const drawerSva = sva({
  base: {
    position: "fixed",
    top: "0",
    left: "0",
    bottom: "0",
    width: "360px",
    maxWidth: "85vw",
    backgroundColor: "var(--md-surface)",
    color: "var(--md-on-surface)",
    zIndex: 2000,
    padding: "16px 0",
    overflowY: "auto",
    boxShadow: "2px 0 8px rgba(0,0,0,0.15)",
    transform: "translateX(-100%)",
    transition: "transform 0.3s ease",
    fontFamily: "var(--md-font-family, Roboto, sans-serif)",
  },
  variants: {
    open: {
      true: { transform: "translateX(0)" },
      false: { transform: "translateX(-100%)" }
    }
  },
  defaultVariants: { open: false }
});

const drawerItemSva = sva({
  base: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 24px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    color: "var(--md-on-surface)",
    borderRadius: "100px",
    margin: "0 8px",
    fontWeight: "400",
  },
  variants: {
    selected: {
      true: {
        backgroundColor: "var(--md-secondary-container)",
        color: "var(--md-on-secondary-container)",
        fontWeight: "500",
      },
      false: {
        backgroundColor: "transparent",
        color: "var(--md-on-surface)",
        fontWeight: "400",
        "&:hover": {
          backgroundColor: "var(--md-surface-variant)",
        }
      }
    }
  },
  defaultVariants: { selected: false }
});

export class NavigationDrawer extends OverlayElement {
  private itemsEl: HTMLElement;
  private items: Array<{ label: string; iconNodes?: SvgIconNode[] }> = [];
  private itemElements: HTMLElement[] = [];
  private selectedIndex: number = -1;
  private _onSelect?: (index: number, label: string) => void;

  constructor(variant: DrawerVariant = "modal") {
    super("div", { 
      scrim: variant === "modal", 
      dismissOnScrimClick: variant === "modal", 
      dismissOnEscape: variant === "modal", 
      exitAnimationMs: 300,
      mountToBody: variant === "modal"
    });

    if (variant === "modal") {
      this.SetScrimColor("rgba(0, 0, 0, 0.32)");
    }

    if (variant === "standard") {
      this.element.style.position = "relative";
      this.element.style.transform = "none";
      this.element.style.boxShadow = "none";
      this.element.style.borderRight = "1px solid var(--md-outline-variant)";
      this.GetIsOpenSignal().Set(true);
    }

    this.element.className = `m3-navigation-drawer m3-navigation-drawer-${variant} ` + drawerSva({ open: variant === "standard" });

    this.itemsEl = document.createElement("div");
    this.element.appendChild(this.itemsEl);

    import("../../../core/src/state/signals.ts").then(({ Bind }) => {
      Bind(this.GetIsOpenSignal(), (isOpen) => {
        this.element.className = `m3-navigation-drawer m3-navigation-drawer-${variant} ` + drawerSva({ open: isOpen });
      });
    });
  }

  AddItem(label: string, iconNodes?: SvgIconNode[]): this {
    this.items.push({ label, iconNodes });
    const item = document.createElement("div");
    item.className = drawerItemSva({ selected: false });
    if (iconNodes) {
      const iconObj = new Icon(iconNodes);
      item.appendChild(iconObj.element);
    }
    const labelSpan = document.createElement("span");
    labelSpan.textContent = label;
    labelSpan.className = "m3-navigation-drawer-label";
    item.appendChild(labelSpan);

    const index = this.items.length - 1;
    item.addEventListener("click", () => this.SelectItem(index));


    this.itemsEl.appendChild(item);
    this.itemElements.push(item);
    return this;
  }

  SelectItem(index: number): this {
    if (index < 0 || index >= this.items.length) return this;
    this.selectedIndex = index;
    this.itemElements.forEach((el, i) => {
      if (i === index) {
        el.className = drawerItemSva({ selected: true });
      } else {
        el.className = drawerItemSva({ selected: false });
      }
    });
    if (this._onSelect) {
      this._onSelect(index, this.items[index]?.label || "");
    }
    return this;
  }

  SetOnSelect(callback: (index: number, label: string) => void): this {
    this._onSelect = callback;
    return this;
  }



  override GetType(): string {
    return "NavigationDrawer";
  }
}

function CreateNavigationDrawer(
  variant: DrawerVariant = "modal",
): NavigationDrawer {
  return new NavigationDrawer(variant);
}

/**
 * AddNavigationDrawer function.
 * @param {import("../../../core/src/elements/Layout.ts").LayoutElement} parent - The parent parameter
 * @param {DrawerVariant} variant - The variant parameter
 * @returns {NavigationDrawer}
 */
export function AddNavigationDrawer(
  parent: import("../../../core/src/elements/Layout.ts").LayoutElement,
  variant: DrawerVariant = "modal",
): NavigationDrawer {
  const drawer = CreateNavigationDrawer(variant);
  parent.AddChild(drawer);
  return drawer;
}
