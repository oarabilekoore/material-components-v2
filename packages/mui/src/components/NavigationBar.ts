import { Icon, SvgIconNode, Icons } from "../icons/Icon.ts";
import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { LayoutElement } from "../../../core/src/elements/Layout.ts";
import { currentTheme } from "../theme.ts";
import { sva } from "../../../core/src/utils/sva.ts";

const navBarSva = sva({
  base: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80px",
    width: "100%",
    backgroundColor: "var(--md-surface)", // Note: fallback if surfaceContainer missing
    boxShadow: "0 -1px 3px rgba(0,0,0,0.1)",
    fontFamily: "var(--md-font-family, Roboto, sans-serif)",
  },
});

const navBarItemSva = sva({
  base: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: "1",
    height: "100%",
    cursor: "pointer",
    minWidth: "48px",
    maxWidth: "80px",
  },
});

const iconContainerSva = sva({
  base: {
    width: "64px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "16px",
    marginBottom: "4px",
    transition: "background-color 0.2s ease, color 0.2s ease",
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
      },
    },
  },
  defaultVariants: { active: false },
});

const labelSva = sva({
  base: {
    fontSize: "12px",
    fontWeight: "500",
    transition: "color 0.2s ease",
  },
  variants: {
    active: {
      true: { color: "var(--md-on-surface)" },
      false: { color: "var(--md-on-surface-variant)" },
    },
  },
  defaultVariants: { active: false },
});

class NavigationBarItem extends BaseElement {
  private _iconContainer: HTMLDivElement;
  private _icon: Icon;
  private _labelEl: HTMLSpanElement;
  private _value: string;

  constructor(iconNodes: SvgIconNode[] | string, label: string, value: string) {
    super("div");
    this._value = value;
    this.element.className = navBarItemSva();

    this._iconContainer = document.createElement("div");
    this._iconContainer.className = iconContainerSva({ active: false });
    this._icon = new Icon(iconNodes);
    this._iconContainer.appendChild(this._icon.element);

    this._labelEl = document.createElement("span");
    this._labelEl.textContent = label;
    this._labelEl.className = labelSva({ active: false });

    this.element.appendChild(this._iconContainer);
    this.element.appendChild(this._labelEl);
  }

  SetActive(active: boolean): void {
    this._iconContainer.className = iconContainerSva({ active });
    this._labelEl.className = labelSva({ active });
  }

  GetValue(): string {
    return this._value;
  }
}

export class NavigationBar extends BaseElement {
  private _items: NavigationBarItem[] = [];
  private _selectedIndex: number = 0;
  private _onSelect: ((index: number, value: string) => void) | null = null;

  constructor() {
    super("nav");
    this.element.className = "m3-navigation-bar " + navBarSva();
    // Re-apply background color using theme if surfaceContainer is available
    if (currentTheme.surfaceContainer) {
      this.element.style.backgroundColor = currentTheme.surfaceContainer;
    }
  }

  AddItem(iconNodes: SvgIconNode[] | string, label: string, value: string): this {
    const item = new NavigationBarItem(iconNodes, label, value);
    const index = this._items.length;

    item.element.addEventListener("click", () => this.Select(index));
    this._items.push(item);
    this.element.appendChild(item.element);

    if (index === this._selectedIndex) {
      item.SetActive(true);
    }

    return this;
  }

  Select(index: number): this {
    if (index < 0 || index >= this._items.length) return this;

    this._items[this._selectedIndex].SetActive(false);
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
    return "NavigationBar";
  }
}

function CreateNavigationBar(): NavigationBar {
  return new NavigationBar();
}

/**
 * AddNavigationBar function.
 * @param {LayoutElement} parent - The parent parameter
 * @returns {NavigationBar}
 *
 */
export function AddNavigationBar(parent: LayoutElement): NavigationBar {
  const nav = CreateNavigationBar();
  parent.AddChild(nav);
  return nav;
}
