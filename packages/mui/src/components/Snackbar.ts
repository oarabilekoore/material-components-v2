import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { currentTheme } from "../theme.ts";
import { attachRipple } from "../../../core/src/utils/ripple.ts";

export class SnackbarManager {
  private static instance: SnackbarManager;
  private queue: Snackbar[] = [];
  private activeSnackbar: Snackbar | null = null;
  private container: HTMLDivElement;

  private constructor() {
    this.container = document.createElement("div");
    this.container.style.cssText = `
      position: fixed;
      left: 50%;
      bottom: 24px;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      z-index: 2000;
      pointer-events: none;
    `;
    if (typeof document !== "undefined") {
      document.body.appendChild(this.container);
    }
  }

  static getInstance(): SnackbarManager {
    if (!SnackbarManager.instance) {
      SnackbarManager.instance = new SnackbarManager();
    }
    return SnackbarManager.instance;
  }

  show(snackbar: Snackbar) {
    this.queue.push(snackbar);
    if (!this.activeSnackbar) {
      this.showNext();
    }
  }

  private showNext() {
    if (this.queue.length === 0) {
      this.activeSnackbar = null;
      return;
    }
    this.activeSnackbar = this.queue.shift()!;
    this.container.appendChild(this.activeSnackbar.element);
    
    // Animate in
    requestAnimationFrame(() => {
      this.activeSnackbar!.element.style.transform = "translateY(0)";
      this.activeSnackbar!.element.style.opacity = "1";
    });

    const duration = this.activeSnackbar.getDuration();
    if (duration > 0) {
      setTimeout(() => {
        this.hideActive();
      }, duration);
    }
  }

  hideActive() {
    if (!this.activeSnackbar) return;
    
    const sb = this.activeSnackbar;
    sb.element.style.transform = "translateY(100px)";
    sb.element.style.opacity = "0";
    
    setTimeout(() => {
      sb.element.remove();
      this.showNext();
    }, 300); // Wait for transition
  }
}

export class Snackbar extends BaseElement {
  private _duration: number = 4000;

  constructor(message: string, action: string = "", onAction?: () => void) {
    super("div");
    this.element.style.cssText = `
      background: ${currentTheme.inverseSurface};
      color: ${currentTheme.inverseOnSurface};
      padding: 12px 24px;
      border-radius: ${currentTheme.shapeCornerSmall * (currentTheme.shapeScale || 1)}px;
      box-shadow: 0 ${currentTheme.elevationLevel3}px ${currentTheme.elevationLevel4}px rgba(0,0,0,0.25);
      display: flex;
      align-items: center;
      gap: 24px;
      font-family: var(--md-font-family, Roboto, sans-serif);
      font-size: 0.875rem;
      transition: transform 0.3s cubic-bezier(0.2, 0, 0, 1), opacity 0.3s cubic-bezier(0.2, 0, 0, 1);
      transform: translateY(100px);
      opacity: 0;
      max-width: 90vw;
      min-width: 288px;
      pointer-events: auto;
    `;

    const messageSpan = document.createElement("span");
    messageSpan.textContent = message;
    messageSpan.style.flex = "1";
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
        padding: 8px;
        margin: -8px 0;
        border-radius: ${currentTheme.shapeCornerSmall * (currentTheme.shapeScale || 1)}px;
        font-size: 0.875rem;
        font-family: var(--md-font-family, Roboto, sans-serif);
        pointer-events: auto;
        transition: background-color 0.2s ease;
      `;
      
      actionBtn.addEventListener("mouseenter", () => {
        actionBtn.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
      });
      actionBtn.addEventListener("mouseleave", () => {
        actionBtn.style.backgroundColor = "transparent";
      });

      actionBtn.addEventListener("click", () => {
        onAction();
        this.Hide();
      });

      attachRipple(actionBtn);
      this.element.appendChild(actionBtn);
    }
  }

  SetDuration(ms: number): this {
    this._duration = ms;
    return this;
  }

  getDuration(): number {
    return this._duration;
  }

  override Show(): this {
    SnackbarManager.getInstance().show(this);
    return this;
  }

  override Hide(): this {
    SnackbarManager.getInstance().hideActive();
    return this;
  }

  override GetType(): string {
    return "Snackbar";
  }
}

function CreateSnackbar(
  message: string,
  action: string = "",
  onAction?: () => void,
): Snackbar {
  return new Snackbar(message, action, onAction);
}

/**
 * AddSnackbar function.
 * @param {string} message - The message parameter
 * @param {string} action - The action parameter
 * @param {() => void} onAction - The onAction parameter
 * @returns {Snackbar}
 *
 */
export function AddSnackbar(
  message: string,
  action: string = "",
  onAction?: () => void,
): Snackbar {
  // Snackbars aren't typically "added" to a parent layout element, they float.
  // But for consistency with the Add... pattern, we can just create and show it.
  const snackbar = CreateSnackbar(message, action, onAction);
  snackbar.Show();
  return snackbar;
}
