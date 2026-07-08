import { BaseElement } from "../../../core/src/elements/base_element.ts";
import { currentTheme } from "../theme.ts";

interface FabMenuItem {
  icon: string;
  label: string;
  callback: () => void;
  row: HTMLDivElement;
}

export class FabMenu extends BaseElement {
  private toggleBtn: HTMLButtonElement;
  private toggleIcon: HTMLSpanElement;
  private itemsContainer: HTMLDivElement;
  private items: FabMenuItem[] = [];
  private _isOpen = false;
  private openIcon: string;
  private closeIcon: string;

  constructor(openIcon = "add", closeIcon = "close") {
    super("div");
    this.openIcon = openIcon;
    this.closeIcon = closeIcon;

    this.element.className = "m3-fab-menu";
    this.element.style.cssText = `
      position: fixed;
      right: 16px;
      bottom: 16px;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 12px;
      z-index: 1500;
      font-family: ${currentTheme.fontFamily};
    `;

    this.itemsContainer = document.createElement("div");
    this.itemsContainer.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 8px;
    `;

    this.toggleBtn = document.createElement("button");
    this.toggleBtn.style.cssText = `
      width: 56px;
      height: 56px;
      border-radius: ${currentTheme.shapeCornerLarge}px;
      background-color: ${currentTheme.primaryContainer};
      color: ${currentTheme.onPrimaryContainer};
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: none;
      cursor: pointer;
      box-shadow: 0 ${currentTheme.elevationLevel3}px ${currentTheme.elevationLevel4}px rgba(0,0,0,0.2);
      transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1), background-color 0.2s ease;
      align-self: flex-end;
    `;

    this.toggleIcon = document.createElement("span");
    this.toggleIcon.className = "material-icons";
    this.toggleIcon.textContent = openIcon;
    this.toggleIcon.style.fontSize = "24px";
    this.toggleIcon.style.transition = "transform 0.2s ease";
    this.toggleBtn.appendChild(this.toggleIcon);

    this.toggleBtn.addEventListener("click", () => this.Toggle());

    this.element.appendChild(this.itemsContainer);
    this.element.appendChild(this.toggleBtn);

    document.body.appendChild(this.element);
  }

  /** Adds a labeled action item to the menu. */
  AddItem(icon: string, label: string, callback: () => void): this {
    const row = document.createElement("div");
    row.style.cssText = `
      display: flex;
      align-items: center;
      gap: 8px;
      opacity: 0;
      transform: translateY(8px);
      pointer-events: none;
      transition: opacity 0.15s ease, transform 0.15s ease;
    `;

    const labelChip = document.createElement("span");
    labelChip.textContent = label;
    labelChip.style.cssText = `
      background: ${currentTheme.surfaceContainer ?? currentTheme.surface};
      color: ${currentTheme.onSurface};
      padding: 6px 12px;
      border-radius: ${currentTheme.shapeCornerSmall}px;
      font-size: 0.875rem;
      box-shadow: 0 ${currentTheme.elevationLevel1}px ${currentTheme.elevationLevel2}px rgba(0,0,0,0.15);
    `;

    const iconBtn = document.createElement("button");
    iconBtn.style.cssText = `
      width: 40px;
      height: 40px;
      border-radius: ${currentTheme.shapeCornerLarge}px;
      background: ${currentTheme.secondaryContainer};
      color: ${currentTheme.onSecondaryContainer};
      border: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 ${currentTheme.elevationLevel1}px ${currentTheme.elevationLevel2}px rgba(0,0,0,0.15);
    `;
    const iconSpan = document.createElement("span");
    iconSpan.className = "material-icons";
    iconSpan.textContent = icon;
    iconSpan.style.fontSize = "20px";
    iconBtn.appendChild(iconSpan);

    iconBtn.addEventListener("click", () => {
      callback();
      this.Close();
    });

    row.appendChild(labelChip);
    row.appendChild(iconBtn);
    this.itemsContainer.appendChild(row);

    this.items.push({ icon, label, callback, row });
    return this;
  }

  Open(): this {
    this._isOpen = true;
    this.toggleIcon.textContent = this.closeIcon;
    this.toggleBtn.style.transform = "rotate(135deg)";
    this.items.forEach((item, i) => {
      // slight stagger so items animate in sequence rather than all at once
      setTimeout(() => {
        item.row.style.opacity = "1";
        item.row.style.transform = "translateY(0)";
        item.row.style.pointerEvents = "auto";
      }, i * 30);
    });
    return this;
  }

  Close(): this {
    this._isOpen = false;
    this.toggleIcon.textContent = this.openIcon;
    this.toggleBtn.style.transform = "rotate(0deg)";
    this.items.forEach((item) => {
      item.row.style.opacity = "0";
      item.row.style.transform = "translateY(8px)";
      item.row.style.pointerEvents = "none";
    });
    return this;
  }

  Toggle(): this {
    return this._isOpen ? this.Close() : this.Open();
  }

  IsOpen(): boolean {
    return this._isOpen;
  }

  override GetType(): string {
    return "FabMenu";
  }
}

export function CreateFabMenu(openIcon = "add", closeIcon = "close"): FabMenu {
  return new FabMenu(openIcon, closeIcon);
}
