import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { LayoutElement } from "../../../core/src/elements/Layout.ts";
import { sva } from "../../../core/src/utils/sva.ts";
import { attachRipple } from "../../../core/src/utils/ripple.ts";

const railSva = sva({
  base: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    backgroundColor: "var(--md-surface)",
    fontFamily: "var(--md-font-family, Roboto, sans-serif)",
    paddingTop: "24px",
    width: "80px",
    alignItems: "center",
    overflowX: "hidden",
    boxSizing: "border-box",
    borderRight: "1px solid var(--md-outline-variant)",
    flexShrink: "0",
  },
});

const itemSva = sva({
  base: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "80px",
    height: "72px",
    cursor: "pointer",
    transition: "all 0.2s cubic-bezier(0.2, 0, 0, 1)",
    boxSizing: "border-box",
    position: "relative",
    gap: "4px",
  },
});

const iconContainerSva = sva({
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "56px",
    height: "32px",
    borderRadius: "16px",
    transition: "all 0.2s cubic-bezier(0.2, 0, 0, 1)",
  },
  variants: {
    active: {
      true: {
        backgroundColor: "var(--md-secondary-container)",
        color: "var(--md-on-secondary-container)",
      },
      false: {
        backgroundColor: "transparent",
        color: "var(--md-on-surface-variant)",
      }
    }
  },
  defaultVariants: {
    active: false,
  }
});

const labelSva = sva({
  base: {
    fontWeight: "500",
    fontSize: "12px",
    transition: "all 0.2s cubic-bezier(0.2, 0, 0, 1)",
    whiteSpace: "nowrap",
  },
  variants: {
    active: {
      true: {
        color: "var(--md-on-surface)",
        fontWeight: "600",
      },
      false: {
        color: "var(--md-on-surface-variant)",
      }
    }
  },
  defaultVariants: {
    active: false,
  }
});

class NavigationRailItem extends BaseElement {
  private _iconContainer: HTMLDivElement;
  private _labelEl: HTMLSpanElement;
  private _value: string;
  private _active: boolean = false;

  constructor(icon: string, label: string, value: string) {
    super("div");
    this._value = value;
    this.element.className = itemSva();

    this._iconContainer = document.createElement("div");
    this._iconContainer.textContent = icon;
    this._iconContainer.className = "material-icons " + iconContainerSva({ active: false });

    this._labelEl = document.createElement("span");
    this._labelEl.textContent = label;
    this._labelEl.className = labelSva({ active: false });

    this.element.appendChild(this._iconContainer);
    this.element.appendChild(this._labelEl);

    attachRipple(this.element);
  }

  SetActive(active: boolean): void {
    this._active = active;
    this._iconContainer.className = "material-icons " + iconContainerSva({ active: this._active });
    this._labelEl.className = labelSva({ active: this._active });
  }

  GetValue(): string {
    return this._value;
  }
}

export class NavigationRail extends BaseElement {
  private _items: NavigationRailItem[] = [];
  private _selectedIndex: number = 0;
  private _onSelect: ((index: number, value: string) => void) | null = null;
  private _fabContainer: HTMLDivElement;
  private _bottomContainer: HTMLDivElement;
  private _itemsContainer: HTMLDivElement;

  constructor() {
    super("nav");
    this.element.className = railSva();

    this._fabContainer = document.createElement("div");
    this._fabContainer.style.marginBottom = "32px";
    this._fabContainer.style.display = "flex";
    this._fabContainer.style.justifyContent = "center";
    this._fabContainer.style.width = "100%";
    this.element.appendChild(this._fabContainer);

    this._itemsContainer = document.createElement("div");
    this._itemsContainer.style.display = "flex";
    this._itemsContainer.style.flexDirection = "column";
    this._itemsContainer.style.alignItems = "center";
    this._itemsContainer.style.width = "100%";
    this._itemsContainer.style.flex = "1";
    this.element.appendChild(this._itemsContainer);

    this._bottomContainer = document.createElement("div");
    this._bottomContainer.style.display = "flex";
    this._bottomContainer.style.flexDirection = "column";
    this._bottomContainer.style.alignItems = "center";
    this._bottomContainer.style.width = "100%";
    this._bottomContainer.style.marginBottom = "24px";
    this._bottomContainer.style.gap = "16px";
    this.element.appendChild(this._bottomContainer);
  }

  SetFab(fab: BaseElement): this {
    this._fabContainer.innerHTML = "";
    this._fabContainer.appendChild(fab.element);
    return this;
  }

  AddItem(icon: string, label: string, value: string): this {
    const item = new NavigationRailItem(icon, label, value);
    const index = this._items.length;
    
    item.element.addEventListener("click", () => this.Select(index));

    this._items.push(item);
    this._itemsContainer.appendChild(item.element);

    if (index === this._selectedIndex) {
      item.SetActive(true);
    }

    return this;
  }

  AddBottomElement(el: BaseElement): this {
    this._bottomContainer.appendChild(el.element);
    return this;
  }

  Select(index: number): this {
    if (index < 0 || index >= this._items.length) return this;

    if (this._items[this._selectedIndex]) {
      this._items[this._selectedIndex].SetActive(false);
    }
    this._selectedIndex = index;
    this._items[this._selectedIndex].SetActive(true);

    if (this._onSelect) {
      this._onSelect(index, this._items[index].GetValue());
    }
    return this;
  }

  SetOnSelect(callback: (index: number, value: string) => void): this {
    this._onSelect = callback;
    return this;
  }

  override GetType(): string {
    return "NavigationRail";
  }
}

function CreateNavigationRail(): NavigationRail {
  return new NavigationRail();
}

/**
 * AddNavigationRail function.
 * @param {LayoutElement} parent - The parent parameter
 * @returns {NavigationRail}
 *
 */
export function AddNavigationRail(parent: LayoutElement): NavigationRail {
  const rail = CreateNavigationRail();
  parent.AddChild(rail);
  return rail;
}
