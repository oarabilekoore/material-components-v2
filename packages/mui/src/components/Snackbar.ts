import { BaseElement } from "../../../core/src/elements/base_element.ts";
import { currentTheme } from "../theme.ts";

export class Snackbar extends BaseElement {
  private _autoHide: boolean = true;
  private _duration: number = 4000;
  private _hideTimer: any = null;

  constructor(message: string, action: string = "", onAction?: () => void) {
    super("div");
    this.element.style.cssText = `
      position: fixed;
      left: 50%;
      bottom: 24px;
      transform: translateX(-50%) translateY(100px);
      background: ${currentTheme.inverseSurface};
      color: ${currentTheme.inverseOnSurface};
      padding: 12px 24px;
      border-radius: ${currentTheme.shapeCornerSmall}px;
      box-shadow: 0 ${currentTheme.elevationLevel3}px ${currentTheme.elevationLevel4}px rgba(0,0,0,0.25);
      display: flex;
      align-items: center;
      gap: 24px;
      z-index: 2000;
      font-family: var(--md-font-family, Roboto, sans-serif);
      font-size: 0.875rem;
      transition: transform 0.3s ease, opacity 0.3s ease;
      opacity: 0;
      max-width: 90%;
      min-width: 200px;
      pointer-events: none;
    `;

    const messageSpan = document.createElement("span");
    messageSpan.textContent = message;
    this.element.appendChild(messageSpan);

    if (action && onAction) {
      const actionBtn = document.createElement("button");
      actionBtn.textContent = action;
      actionBtn.style.cssText = `
        background: transparent;
        border: none;
        color: ${currentTheme.inversePrimary};
        font-weight: 500;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: ${currentTheme.shapeCornerSmall}px;
        font-size: 0.875rem;
        font-family: var(--md-font-family, Roboto, sans-serif);
        pointer-events: auto;
      `;
      actionBtn.addEventListener("click", () => {
        onAction();
        this.Hide();
      });
      this.element.appendChild(actionBtn);
      this.element.style.pointerEvents = "auto";
    }

    document.body.appendChild(this.element);
  }

  override Show(): this {
    this.element.style.transform = "translateX(-50%) translateY(0)";
    this.element.style.opacity = "1";
    if (this._autoHide) {
      if (this._hideTimer) clearTimeout(this._hideTimer);
      this._hideTimer = setTimeout(() => this.Hide(), this._duration);
    }
    return this;
  }

  override Hide(): this {
    this.element.style.transform = "translateX(-50%) translateY(100px)";
    this.element.style.opacity = "0";
    return this;
  }

  override GetType(): string {
    return "Snackbar";
  }
}

export function CreateSnackbar(
  message: string,
  action: string = "",
  onAction?: () => void,
): Snackbar {
  return new Snackbar(message, action, onAction);
}
