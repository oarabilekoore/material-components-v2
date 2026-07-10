import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { currentTheme } from "../theme.ts";

export class Menu extends BaseElement {
  private _isOpen: boolean = false;
  private _items: HTMLDivElement[] = [];
  private _outsideClickHandler = (e: MouseEvent) => {
    if (!this.element.contains(e.target as Node)) {
      this.Close();
    }
  };

  constructor() {
    super("div");
    this.element.className = "m3-menu";
    this.element.style.position = "absolute";
    this.element.style.backgroundColor = currentTheme.surface;
    this.element.style.borderRadius = `${currentTheme.shapeCornerExtraSmall}px`;
    this.element.style.boxShadow = `0 ${currentTheme.elevationLevel2}px ${currentTheme.elevationLevel3}px rgba(0,0,0,0.2)`;
    this.element.style.padding = "8px 0";
    this.element.style.minWidth = "112px";
    this.element.style.maxWidth = "280px";
    this.element.style.fontFamily = currentTheme.fontFamily;
    this.element.style.zIndex = "2000";
    this.element.style.display = "none";
    this.element.style.flexDirection = "column";
    // no document listener here anymore — attached only while open, in OpenAt/Close below
  }

  AddItem(label: string, callback: () => void, icon?: string): this {
    const item = document.createElement("div");
    item.style.display = "flex";
    item.style.alignItems = "center";
    item.style.padding = "0 12px";
    item.style.minHeight = "48px";
    item.style.cursor = "pointer";
    item.style.color = currentTheme.onSurface;
    item.style.fontSize = "14px";
    item.style.transition = "background-color 0.2s ease";

    if (icon) {
      const iconSpan = document.createElement("span");
      iconSpan.textContent = icon;
      iconSpan.className = "material-icons";
      iconSpan.style.marginRight = "12px";
      item.appendChild(iconSpan);
    }

    const labelSpan = document.createElement("span");
    labelSpan.textContent = label;
    item.appendChild(labelSpan);

    item.addEventListener("mouseenter", () => {
      item.style.backgroundColor = currentTheme.surfaceVariant;
    });
    item.addEventListener("mouseleave", () => {
      item.style.backgroundColor = "transparent";
    });
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      callback();
      this.Close();
    });

    this._items.push(item);
    this.element.appendChild(item);
    return this;
  }

  /** Opens the menu at a specific screen position. */
  OpenAt(x: number, y: number): this {
    this.element.style.display = "flex";
    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;
    this._isOpen = true;
    document.body.appendChild(this.element);

    // defer attaching the outside-click listener until after this click event
    // finishes bubbling, so the click that opened the menu doesn't also close it
    setTimeout(() => {
      document.addEventListener("click", this._outsideClickHandler);
    }, 0);

    return this;
  }

  /** Opens the menu anchored below a target element. */
  ShowAtElement(target: BaseElement): this {
    const rect = target.element.getBoundingClientRect();
    return this.OpenAt(
      rect.left + window.scrollX,
      rect.bottom + window.scrollY,
    );
  }

  Close(): this {
    this.element.style.display = "none";
    this._isOpen = false;
    document.removeEventListener("click", this._outsideClickHandler);
    if (this.element.parentElement) {
      this.element.parentElement.removeChild(this.element);
    }
    return this;
  }

  override GetType(): string {
    return "Menu";
  }
}

function CreateMenu(): Menu {
  return new Menu();
}
