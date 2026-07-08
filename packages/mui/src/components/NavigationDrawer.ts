import { BaseElement } from "../../../core/src/elements/base_element.ts";
import { DrawerVariant, currentTheme } from "../theme.ts";

export class NavigationDrawer extends BaseElement {
  private scrim: HTMLElement;
  private itemsEl: HTMLElement;
  private items: Array<{ label: string; icon: string }> = [];
  private itemElements: HTMLElement[] = [];
  private selectedIndex: number = -1;
  private _onSelect?: (index: number, label: string) => void;
  private _isOpen: boolean = false;

  constructor(variant: DrawerVariant = "modal") {
    super("div");
    this.scrim = document.createElement("div");
    this.scrim.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: ${currentTheme.scrim}40;
      z-index: 1999;
      display: none;
      animation: fadeIn 0.2s ease;
    `;
    this.scrim.addEventListener("click", () => this.Close());

    this.element.className = `m3-navigation-drawer m3-navigation-drawer-${variant}`;
    this.element.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      width: 360px;
      max-width: 85vw;
      background: ${currentTheme.surface};
      color: ${currentTheme.onSurface};
      z-index: 2000;
      padding: 16px 0;
      overflow-y: auto;
      box-shadow: 2px 0 8px rgba(0,0,0,0.15);
      transform: translateX(-100%);
      transition: transform 0.3s ease;
      font-family: var(--md-font-family, Roboto, sans-serif);
    `;

    this.itemsEl = document.createElement("div");
    this.element.appendChild(this.itemsEl);

    this.scrim.appendChild(this.element);
    document.body.appendChild(this.scrim);
  }

  AddItem(label: string, icon: string = ""): this {
    this.items.push({ label, icon });
    const item = document.createElement("div");
    item.style.cssText = `
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 24px;
      cursor: pointer;
      transition: background 0.2s ease;
      color: ${currentTheme.onSurface};
      border-radius: ${currentTheme.shapeCornerFull}px;
      margin: 0 8px;
    `;
    if (icon) {
      const iconSpan = document.createElement("span");
      iconSpan.textContent = icon;
      iconSpan.style.fontSize = "24px";
      iconSpan.style.width = "24px";
      item.appendChild(iconSpan);
    }
    const labelSpan = document.createElement("span");
    labelSpan.textContent = label;
    labelSpan.style.fontSize = "0.875rem";
    item.appendChild(labelSpan);

    const index = this.items.length - 1;
    item.addEventListener("click", () => this.SelectItem(index));
    item.addEventListener("mouseenter", () => {
      if (this.selectedIndex !== index)
        item.style.backgroundColor = currentTheme.surfaceVariant;
    });
    item.addEventListener("mouseleave", () => {
      if (this.selectedIndex !== index)
        item.style.backgroundColor = "transparent";
    });

    this.itemsEl.appendChild(item);
    this.itemElements.push(item);
    return this;
  }

  SelectItem(index: number): this {
    if (index < 0 || index >= this.items.length) return this;
    this.selectedIndex = index;
    this.itemElements.forEach((el, i) => {
      if (i === index) {
        el.style.backgroundColor = currentTheme.secondaryContainer;
        el.style.color = currentTheme.onSecondaryContainer;
        el.style.fontWeight = "500";
      } else {
        el.style.backgroundColor = "transparent";
        el.style.color = currentTheme.onSurface;
        el.style.fontWeight = "400";
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

  Open(): this {
    this._isOpen = true;
    this.scrim.style.display = "block";
    void this.element.offsetHeight;
    this.element.style.transform = "translateX(0)";
    return this;
  }

  Close(): this {
    this._isOpen = false;
    this.element.style.transform = "translateX(-100%)";
    setTimeout(() => {
      this.scrim.style.display = "none";
    }, 300);
    return this;
  }

  IsOpen(): boolean {
    return this._isOpen;
  }

  override GetType(): string {
    return "NavigationDrawer";
  }
}

export function CreateNavigationDrawer(
  variant: DrawerVariant = "modal",
): NavigationDrawer {
  return new NavigationDrawer(variant);
}
