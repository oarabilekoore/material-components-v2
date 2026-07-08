import { BaseElement } from "../../../core/src/elements/base_element.ts";
import { LayoutElement } from "../../../core/src/elements/layout_element.ts";
import { currentTheme } from "../theme.ts";

class NavigationRailItem extends BaseElement {
  private _iconContainer: HTMLDivElement;
  private _labelEl: HTMLSpanElement;
  private _value: string;

  constructor(icon: string, label: string, value: string) {
    super("div");
    this._value = value;

    this.element.style.display = "flex";
    this.element.style.flexDirection = "column";
    this.element.style.alignItems = "center";
    this.element.style.justifyContent = "center";
    this.element.style.flex = "1";
    this.element.style.height = "100%";
    this.element.style.cursor = "pointer";
    this.element.style.minWidth = "48px";
    this.element.style.maxWidth = "80px";

    this._iconContainer = document.createElement("div");
    this._iconContainer.textContent = icon;
    this._iconContainer.style.width = "64px";
    this._iconContainer.style.height = "32px";
    this._iconContainer.style.display = "flex";
    this._iconContainer.style.alignItems = "center";
    this._iconContainer.style.justifyContent = "center";
    this._iconContainer.style.borderRadius = "16px";
    this._iconContainer.style.marginBottom = "4px";
    this._iconContainer.style.transition = "background-color 0.2s ease";

    this._labelEl = document.createElement("span");
    this._labelEl.textContent = label;
    this._labelEl.style.fontSize = "12px";
    this._labelEl.style.fontWeight = "500";
    this._labelEl.style.color = currentTheme.onSurfaceVariant;

    this.element.appendChild(this._iconContainer);
    this.element.appendChild(this._labelEl);
  }

  SetActive(active: boolean): void {
    if (active) {
      this._iconContainer.style.backgroundColor =
        currentTheme.secondaryContainer;
      this._iconContainer.style.color = currentTheme.onSecondaryContainer;
      this._labelEl.style.color = currentTheme.onSurface;
    } else {
      this._iconContainer.style.backgroundColor = "transparent";
      this._iconContainer.style.color = currentTheme.onSurfaceVariant;
      this._labelEl.style.color = currentTheme.onSurfaceVariant;
    }
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

  constructor() {
    super("nav");
    this.element.className = "m3-navigation-rail";
    this.element.style.display = "flex";
    this.element.style.flexDirection = "column";
    this.element.style.alignItems = "center";
    this.element.style.width = "80px";
    this.element.style.height = "100%";
    this.element.style.backgroundColor = currentTheme.surface;
    this.element.style.fontFamily = currentTheme.fontFamily;
    this.element.style.paddingTop = "44px";

    this._fabContainer = document.createElement("div");
    this._fabContainer.style.marginBottom = "32px";
    this._fabContainer.style.display = "flex";
    this._fabContainer.style.justifyContent = "center";
    this.element.appendChild(this._fabContainer);
  }

  SetFab(fab: BaseElement): this {
    this._fabContainer.innerHTML = "";
    this._fabContainer.appendChild(fab.element);
    return this;
  }

  AddItem(icon: string, label: string, value: string): this {
    const item = new NavigationRailItem(icon, label, value);
    item.element.style.height = "72px";
    item.element.style.flex = "none";

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
    return "NavigationRail";
  }
}

export function CreateNavigationRail(): NavigationRail {
  return new NavigationRail();
}

export function AddNavigationRail(parent: LayoutElement): NavigationRail {
  const rail = CreateNavigationRail();
  parent.AddChild(rail);
  return rail;
}
