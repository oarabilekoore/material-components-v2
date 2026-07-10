import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { LayoutElement } from "../../../core/src/elements/Layout.ts";
import { currentTheme } from "../theme.ts";

class NavigationBarItem extends BaseElement {
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
    this._iconContainer.className = "material-icons";
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

export class NavigationBar extends BaseElement {
  private _items: NavigationBarItem[] = [];
  private _selectedIndex: number = 0;
  private _onSelect: ((index: number, value: string) => void) | null = null;

  constructor() {
    super("nav");
    this.element.className = "m3-navigation-bar";
    this.element.style.display = "flex";
    this.element.style.justifyContent = "center";
    this.element.style.alignItems = "center";
    this.element.style.height = "80px";
    this.element.style.width = "100%";
    this.element.style.backgroundColor =
      currentTheme.surfaceContainer || currentTheme.surface;
    this.element.style.boxShadow = `0 -1px 3px rgba(0,0,0,0.1)`;
    this.element.style.fontFamily = currentTheme.fontFamily;
  }

  AddItem(icon: string, label: string, value: string): this {
    const item = new NavigationBarItem(icon, label, value);
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
