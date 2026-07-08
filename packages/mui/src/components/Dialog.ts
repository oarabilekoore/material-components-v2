import { BaseElement } from "../../../core/src/elements/base_element.ts";
import { DialogType, currentTheme } from "../theme.ts";

export class Dialog extends BaseElement {
  private scrim: HTMLElement;
  private iconEl: HTMLElement;
  private titleEl: HTMLElement;
  private contentEl: HTMLElement;
  private actionsEl: HTMLElement;
  private headerEl: HTMLElement | null = null;
  private divider: HTMLElement | null = null;
  private type: DialogType;
  private _isOpen = false;
  private _onCancel?: () => void;
  private _onKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape") this.Cancel();
  };

  constructor(type: DialogType = "basic") {
    super("div");
    this.type = type;

    this.scrim = document.createElement("div");
    this.scrim.style.cssText = `
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: ${currentTheme.scrim}40;
      z-index: 1999;
      display: none;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.2s ease;
    `;
    this.scrim.addEventListener("click", (e) => {
      if (e.target === this.scrim) this.Cancel();
    });

    this.element.className = `m3-dialog m3-dialog-${type}`;
    this.element.setAttribute("role", "dialog");
    this.element.setAttribute("aria-modal", "true");
    this.element.style.cssText = `
      background: ${currentTheme.surface};
      color: ${currentTheme.onSurface};
      border-radius: ${type === "full-screen" ? "0" : `${currentTheme.shapeCornerExtraLarge}px`};
      padding: ${type === "full-screen" ? "0" : "24px"};
      width: ${type === "full-screen" ? "100vw" : "560px"};
      height: ${type === "full-screen" ? "100vh" : "auto"};
      max-width: ${type === "full-screen" ? "none" : "90vw"};
      max-height: ${type === "full-screen" ? "100vh" : "80vh"};
      box-shadow: ${type === "full-screen" ? "none" : `0 ${currentTheme.elevationLevel3}px ${currentTheme.elevationLevel5}px rgba(0,0,0,0.3)`};
      display: flex;
      flex-direction: column;
      gap: ${type === "full-screen" ? "0" : "16px"};
      z-index: 2000;
      font-family: ${currentTheme.fontFamily};
      animation: ${type === "full-screen" ? "slideUp" : "scaleIn"} 0.2s ease;
      overflow: hidden;
    `;

    if (type === "full-screen") {
      // --- Full-screen anatomy: Header (close icon, title, confirm action) ---
      this.headerEl = document.createElement("div");
      this.headerEl.style.cssText = `
        display: flex;
        align-items: center;
        height: 64px;
        padding: 0 8px 0 4px;
        flex-shrink: 0;
      `;

      const closeIcon = document.createElement("span");
      closeIcon.className = "material-icons";
      closeIcon.textContent = "close";
      closeIcon.style.cssText = `
        cursor: pointer;
        font-size: 24px;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
      `;
      closeIcon.addEventListener("click", () => this.Cancel());

      this.titleEl = document.createElement("div");
      this.titleEl.style.cssText = `
        flex: 1;
        font-size: 1.375rem;
        font-weight: 400;
        padding-left: 8px;
      `;

      this.actionsEl = document.createElement("div");
      this.actionsEl.style.cssText = `display: flex; align-items: center; gap: 8px;`;

      this.headerEl.appendChild(closeIcon);
      this.headerEl.appendChild(this.titleEl);
      this.headerEl.appendChild(this.actionsEl);
      this.element.appendChild(this.headerEl);

      // icon slot unused for full-screen per spec; kept as a detached no-op element
      this.iconEl = document.createElement("div");

      this.contentEl = document.createElement("div");
      this.contentEl.style.cssText = `
        flex: 1;
        overflow-y: auto;
        padding: 16px 24px 24px 24px;
        font-size: 0.875rem;
        color: ${currentTheme.onSurfaceVariant};
      `;
      this.element.appendChild(this.contentEl);
    } else {
      // --- Basic anatomy: optional Icon, Headline, Supporting text, optional Divider, Buttons ---
      this.iconEl = document.createElement("div");
      this.iconEl.className = "material-icons";
      this.iconEl.style.cssText = `
        font-size: 24px;
        color: ${currentTheme.secondary};
        display: none;
      `;
      this.element.appendChild(this.iconEl);

      this.titleEl = document.createElement("div");
      this.titleEl.style.cssText = `
        font-size: 1.5rem;
        font-weight: 400;
        line-height: 2rem;
      `;
      this.element.appendChild(this.titleEl);

      this.contentEl = document.createElement("div");
      this.contentEl.style.cssText = `
        font-size: 0.875rem;
        color: ${currentTheme.onSurfaceVariant};
        overflow-y: auto;
        flex: 1;
      `;
      this.element.appendChild(this.contentEl);

      this.actionsEl = document.createElement("div");
      this.actionsEl.style.cssText = `
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 8px;
        flex-shrink: 0;
      `;
      this.element.appendChild(this.actionsEl);
    }

    this.scrim.appendChild(this.element);
    document.body.appendChild(this.scrim);
    this.ensureAnimations();
  }

  private ensureAnimations(): void {
    if (!document.getElementById("m3-dialog-animations")) {
      const style = document.createElement("style");
      style.id = "m3-dialog-animations";
      style.textContent = `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `;
      document.head.appendChild(style);
    }
  }

  /** Sets the optional icon above the headline. Basic dialogs only, per spec anatomy. */
  SetIcon(iconName: string): this {
    if (this.type !== "basic") return this;
    this.iconEl.textContent = iconName;
    this.iconEl.style.display = "block";
    return this;
  }

  SetTitle(title: string): this {
    this.titleEl.textContent = title;
    return this;
  }

  SetContent(content: string): this {
    this.contentEl.textContent = content;
    return this;
  }

  SetHtml(html: string): this {
    this.contentEl.innerHTML = html;
    return this;
  }

  /** Appends any control's element directly into the content area. */
  AddContent(el: BaseElement): this {
    this.contentEl.appendChild(el.element);
    return this;
  }

  /** Adds an optional divider, shown per spec when content is scrollable. */
  ShowDivider(): this {
    if (this.divider) return this;
    this.divider = document.createElement("div");
    this.divider.style.cssText = `height: 1px; background: ${currentTheme.outlineVariant}; flex-shrink: 0;`;
    this.contentEl.insertAdjacentElement(
      this.type === "full-screen" ? "beforebegin" : "afterend",
      this.divider,
    );
    return this;
  }

  /** Adds a text-button action. Basic: stacks bottom-right. Full-screen: single confirm action in the header. */
  AddAction(text: string, callback: () => void): this {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.style.cssText = `
      padding: 8px 16px;
      border: none;
      background: transparent;
      color: ${currentTheme.primary};
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      border-radius: ${currentTheme.shapeCornerSmall}px;
      transition: background 0.2s ease;
      font-family: ${currentTheme.fontFamily};
    `;
    btn.addEventListener("mouseenter", () => {
      btn.style.backgroundColor = currentTheme.primaryContainer;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.backgroundColor = "transparent";
    });
    btn.addEventListener("click", callback);
    this.actionsEl.appendChild(btn);
    return this;
  }

  /** Registers a callback for scrim-click / Escape-key dismissal, per spec's cancel behavior. */
  SetOnCancel(callback: () => void): this {
    this._onCancel = callback;
    return this;
  }

  private Cancel(): void {
    this._onCancel?.();
    this.Close();
  }

  override Show(): this {
    this._isOpen = true;
    this.scrim.style.display = "flex";
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", this._onKeydown);
    return this;
  }

  Close(): this {
    this._isOpen = false;
    this.scrim.style.display = "none";
    document.body.style.overflow = "";
    document.removeEventListener("keydown", this._onKeydown);
    return this;
  }

  IsOpen(): boolean {
    return this._isOpen;
  }

  override GetType(): string {
    return "Dialog";
  }
}

export function CreateDialog(type: DialogType = "basic"): Dialog {
  return new Dialog(type);
}
