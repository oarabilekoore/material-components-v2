import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { Icon, Icons } from "../icons/Icon.ts";
import { currentTheme } from "../theme.ts";
import { attachRipple } from "../../../core/src/utils/ripple.ts";
import { sva } from "../../../core/src/utils/sva.ts";

const containerSva = sva({
  base: {
    position: "fixed",
    left: "50%",
    bottom: "24px",
    transform: "translateX(-50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    zIndex: 2000,
    pointerEvents: "none",
  },
});

const snackbarSva = sva({
  base: {
    backgroundColor: "var(--md-inverse-surface)",
    color: "var(--md-inverse-on-surface)",
    padding: "12px 24px",
    borderRadius: "calc(var(--md-shape-corner-small) * var(--md-shape-scale, 1))",
    boxShadow: "0 3px 6px rgba(0,0,0,0.25)",
    display: "flex",
    alignItems: "center",
    gap: "24px",
    fontFamily: "var(--md-font-family, Roboto, sans-serif)",
    fontSize: "0.875rem",
    transition: "transform 0.3s cubic-bezier(0.2, 0, 0, 1), opacity 0.3s cubic-bezier(0.2, 0, 0, 1)",
    transform: "translateY(100px)",
    opacity: "0",
    maxWidth: "90vw",
    minWidth: "288px",
    pointerEvents: "auto",
  },
});

const actionBtnSva = sva({
  base: {
    background: "transparent",
    border: "none",
    color: "var(--md-inverse-primary)",
    fontWeight: "500",
    cursor: "pointer",
    padding: "8px",
    margin: "-8px 0",
    borderRadius: "calc(var(--md-shape-corner-small) * var(--md-shape-scale, 1))",
    fontSize: "0.875rem",
    fontFamily: "var(--md-font-family, Roboto, sans-serif)",
    pointerEvents: "auto",
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.08)",
    },
  },
});

export class SnackbarManager {
  private static instance: SnackbarManager;
  private queue: SnackbarEl[] = [];
  private activeSnackbar: SnackbarEl | null = null;
  private container: HTMLDivElement;

  private constructor() {
    this.container = document.createElement("div");
    this.container.className = containerSva();
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

  show(snackbar: SnackbarEl) {
    if (this.activeSnackbar === snackbar || this.queue.includes(snackbar)) {
      return;
    }
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
      if (this.activeSnackbar) {
        this.activeSnackbar.element.style.transform = "translateY(0)";
        this.activeSnackbar.element.style.opacity = "1";
      }
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
    this.activeSnackbar = null;
    sb.element.style.transform = "translateY(100px)";
    sb.element.style.opacity = "0";
    
    setTimeout(() => {
      sb.element.remove();
      this.showNext();
    }, 300); // Wait for transition
  }
}

export class SnackbarEl extends BaseElement {
  private _duration: number = 4000;

  constructor(message: string, action: string = "", onAction?: () => void, showCloseIcon: boolean = false) {
    super("div");
    this.element.className = "m3-snackbar " + snackbarSva();

    const messageSpan = document.createElement("span");
    messageSpan.textContent = message;
    messageSpan.style.flex = "1";
    this.element.appendChild(messageSpan);

    if (action && onAction) {
      const actionBtn = document.createElement("button");
      actionBtn.textContent = action;
      actionBtn.className = actionBtnSva();

      actionBtn.addEventListener("click", () => {
        onAction();
        this.Hide();
      });

      attachRipple(actionBtn);
      this.element.appendChild(actionBtn);
    }

    if (showCloseIcon) {
      const closeBtn = new Icon("close");
      closeBtn.element.style.cursor = "pointer";
      closeBtn.element.style.marginLeft = "8px";
      closeBtn.element.style.color = "var(--md-inverse-on-surface)";
      closeBtn.element.addEventListener("click", () => {
        this.Hide();
      });
      this.element.appendChild(closeBtn.element);
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
): SnackbarEl {
  return new SnackbarEl(message, action, onAction);
}

/**
 * AddSnackbar function.
 * @param {string} message - The message parameter
 * @param {string} action - The action parameter
 * @param {() => void} onAction - The onAction parameter
 * @returns {SnackbarEl}
 *
 */
export function Snackbar(
  message: string,
  action: string = "",
  onAction?: () => void,
): SnackbarEl {
  // Snackbars aren't typically "added" to a parent layout element, they float.
  // But for consistency with the Add... pattern, we can just create and show it.
  const snackbar = CreateSnackbar(message, action, onAction);
  snackbar.Show();
  return snackbar;
}
