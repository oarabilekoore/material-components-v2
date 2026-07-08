import { BaseElement } from "../../../core/src/elements/base_element.ts";
import { currentTheme } from "../theme.ts";

export class BottomSheet extends BaseElement {
  private scrim: HTMLElement;
  private contentEl: HTMLElement;
  private _isOpen: boolean = false;

  constructor() {
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

    this.element.className = "m3-bottom-sheet";
    this.element.style.cssText = `
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      background: ${currentTheme.surface};
      color: ${currentTheme.onSurface};
      border-radius: ${currentTheme.shapeCornerLarge}px ${currentTheme.shapeCornerLarge}px 0 0;
      padding: 16px 24px 24px;
      z-index: 2000;
      max-height: 80vh;
      overflow-y: auto;
      transform: translateY(100%);
      transition: transform 0.3s ease;
      font-family: var(--md-font-family, Roboto, sans-serif);
      box-shadow: 0 -2px 8px rgba(0,0,0,0.1);
    `;

    const handle = document.createElement("div");
    handle.style.cssText = `
      width: 40px;
      height: 4px;
      background: ${currentTheme.outlineVariant};
      border-radius: 2px;
      margin: 0 auto 12px;
    `;
    this.element.appendChild(handle);

    this.contentEl = document.createElement("div");
    this.contentEl.className = "sheet-content";
    this.element.appendChild(this.contentEl);

    this.scrim.appendChild(this.element);
    document.body.appendChild(this.scrim);
  }

  SetContent(content: string): this {
    this.contentEl.textContent = content;
    return this;
  }

  SetHtml(html: string): this {
    this.contentEl.innerHTML = html;
    return this;
  }

  override Show(): this {
    this._isOpen = true;
    this.scrim.style.display = "block";
    void this.element.offsetHeight;
    this.element.style.transform = "translateY(0)";
    return this;
  }

  Close(): this {
    this._isOpen = false;
    this.element.style.transform = "translateY(100%)";
    setTimeout(() => {
      this.scrim.style.display = "none";
    }, 300);
    return this;
  }

  override GetType(): string {
    return "BottomSheet";
  }
}

export function CreateBottomSheet(): BottomSheet {
  return new BottomSheet();
}
