import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { DialogType } from "../theme.ts";
import { sva } from "../../../core/src/utils/sva.ts";

const scrimSva = sva({
  base: {
    position: "fixed",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    zIndex: 1999,
    display: "none",
    alignItems: "center",
    justifyContent: "center",
  },
});

const dialogSva = sva({
  base: {
    backgroundColor: "var(--md-surface)",
    color: "var(--md-on-surface)",
    display: "flex",
    flexDirection: "column",
    zIndex: 2000,
    fontFamily: "var(--md-font-family, Roboto, sans-serif)",
    overflow: "hidden",
  },
  variants: {
    type: {
      basic: {
        borderRadius: "28px",
        padding: "24px",
        width: "560px",
        height: "auto",
        maxWidth: "90vw",
        maxHeight: "80vh",
        boxShadow: "0 6px 12px rgba(0,0,0,0.3)",
        gap: "16px",
      },
      "full-screen": {
        borderRadius: "0",
        padding: "0",
        width: "100vw",
        height: "100vh",
        maxWidth: "none",
        maxHeight: "100vh",
        boxShadow: "none",
        gap: "0",
      },
    },
  },
  defaultVariants: {
    type: "basic",
  },
});

const fullScreenHeaderSva = sva({
  base: {
    display: "flex",
    alignItems: "center",
    height: "64px",
    padding: "0 8px 0 4px",
    flexShrink: 0,
  },
});

const closeIconSva = sva({
  base: {
    cursor: "pointer",
    fontSize: "24px",
    width: "48px",
    height: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

const fullScreenTitleSva = sva({
  base: {
    flex: "1",
    fontSize: "1.375rem",
    fontWeight: "400",
    paddingLeft: "8px",
  },
});

const fullScreenActionsSva = sva({
  base: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
});

const basicIconSva = sva({
  base: {
    fontSize: "24px",
    color: "var(--md-secondary)",
    display: "none",
  },
});

const basicTitleSva = sva({
  base: {
    fontSize: "1.5rem",
    fontWeight: "400",
    lineHeight: "2rem",
  },
});

const contentSva = sva({
  base: {
    fontSize: "0.875rem",
    overflowY: "auto",
    flex: "1",
  },
  variants: {
    type: {
      basic: {
        color: "var(--md-on-surface-variant)",
      },
      "full-screen": {
        padding: "16px 24px 24px 24px",
        color: "var(--md-on-surface-variant)",
      },
    },
  },
});

const basicActionsSva = sva({
  base: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
    marginTop: "8px",
    flexShrink: 0,
  },
});

const actionBtnSva = sva({
  base: {
    padding: "8px 16px",
    border: "none",
    background: "transparent",
    color: "var(--md-primary)",
    fontSize: "0.875rem",
    fontWeight: "500",
    cursor: "pointer",
    borderRadius: "8px",
    transition: "background-color 0.2s ease",
    fontFamily: "var(--md-font-family, Roboto, sans-serif)",
  },
});

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
    this.scrim.className = scrimSva();
    this.scrim.addEventListener("click", (e) => {
      if (e.target === this.scrim) this.Cancel();
    });

    this.element.className = `m3-dialog m3-dialog-${type} ` + dialogSva({ type });
    this.element.setAttribute("role", "dialog");
    this.element.setAttribute("aria-modal", "true");

    if (type === "full-screen") {
      this.headerEl = document.createElement("div");
      this.headerEl.className = fullScreenHeaderSva();

      const closeIcon = document.createElement("span");
      closeIcon.className = "material-icons " + closeIconSva();
      closeIcon.textContent = "close";
      closeIcon.addEventListener("click", () => this.Cancel());

      this.titleEl = document.createElement("div");
      this.titleEl.className = fullScreenTitleSva();

      this.actionsEl = document.createElement("div");
      this.actionsEl.className = fullScreenActionsSva();

      this.headerEl.appendChild(closeIcon);
      this.headerEl.appendChild(this.titleEl);
      this.headerEl.appendChild(this.actionsEl);
      this.element.appendChild(this.headerEl);

      this.iconEl = document.createElement("div");

      this.contentEl = document.createElement("div");
      this.contentEl.className = contentSva({ type });
      this.element.appendChild(this.contentEl);
    } else {
      this.iconEl = document.createElement("div");
      this.iconEl.className = "material-icons " + basicIconSva();
      this.element.appendChild(this.iconEl);

      this.titleEl = document.createElement("div");
      this.titleEl.className = basicTitleSva();
      this.element.appendChild(this.titleEl);

      this.contentEl = document.createElement("div");
      this.contentEl.className = contentSva({ type });
      this.element.appendChild(this.contentEl);

      this.actionsEl = document.createElement("div");
      this.actionsEl.className = basicActionsSva();
      this.element.appendChild(this.actionsEl);
    }

    this.scrim.appendChild(this.element);
    if (typeof document !== "undefined") {
      document.body.appendChild(this.scrim);
      this.ensureAnimations();
    }
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

  AddContent(el: BaseElement): this {
    this.contentEl.appendChild(el.element);
    return this;
  }

  ShowDivider(): this {
    if (this.divider) return this;
    this.divider = document.createElement("div");
    this.divider.style.cssText = `height: 1px; background: var(--md-outline-variant); flex-shrink: 0;`;
    this.contentEl.insertAdjacentElement(
      this.type === "full-screen" ? "beforebegin" : "afterend",
      this.divider,
    );
    return this;
  }

  AddAction(text: string, callback: () => void): this {
    const btn = document.createElement("button");
    btn.className = actionBtnSva();
    btn.textContent = text;
    
    btn.addEventListener("mouseenter", () => {
      btn.style.backgroundColor = "var(--md-primary-container)";
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.backgroundColor = "transparent";
    });
    btn.addEventListener("click", callback);
    this.actionsEl.appendChild(btn);
    return this;
  }

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
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", this._onKeydown);
    }
    return this;
  }

  Close(): this {
    this._isOpen = false;
    this.scrim.style.display = "none";
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", this._onKeydown);
    }
    return this;
  }

  IsOpen(): boolean {
    return this._isOpen;
  }

  override GetType(): string {
    return "Dialog";
  }
}

function CreateDialog(type: DialogType = "basic"): Dialog {
  return new Dialog(type);
}
