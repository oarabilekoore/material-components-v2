import { Icon, SvgIconNode, Icons } from "../icons/Icon.ts";
import { OverlayElement } from "../../../core/src/elements/Overlay.ts";
import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { LayoutElement } from "../../../core/src/elements/Layout.ts";
import { sva } from "../../../core/src/utils/sva.ts";
import { attachRipple } from "../../../core/src/utils/ripple.ts";
import { Bind } from "../../../core/src/state/signals.ts";

// scrimSva removed because OverlayElement provides it

const sheetSva = sva({
  base: {
    position: "fixed",
    top: "0",
    bottom: "0",
    width: "360px",
    backgroundColor: "var(--md-surface-container-low, var(--md-surface))",
    boxSizing: "border-box",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    fontFamily: "var(--md-font-family, Roboto, sans-serif)",
    color: "var(--md-on-surface)",
    zIndex: 100,
    transition: "transform 0.3s cubic-bezier(0.2, 0, 0, 1)",
  },
  variants: {
    type: {
      modal: {
        right: "0",
        borderTopLeftRadius: "16px",
        borderBottomLeftRadius: "16px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
        transform: "translateX(100%)",
      },
      standard: {
        right: "0", // Usually standard are docked, but let's keep it sliding from right
        borderTopLeftRadius: "0",
        borderBottomLeftRadius: "0",
        boxShadow: "none",
        borderLeft: "1px solid var(--md-outline-variant)",
        transform: "translateX(100%)",
      }
    },
    open: {
      true: {
        transform: "translateX(0)",
      },
      false: {}
    }
  },
  defaultVariants: {
    type: "modal",
    open: false,
  }
});

const headerSva = sva({
  base: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

const titleSva = sva({
  base: {
    fontSize: "20px",
    fontWeight: "500",
    color: "var(--md-on-surface)",
  },
});

const closeBtnSva = sva({
  base: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "var(--md-on-surface-variant)",
    outline: "none",
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

const contentSva = sva({
  base: {
    flex: "1",
    overflowY: "auto",
    scrollSnapType: "y mandatory",
  },
});

export class SideSheet extends OverlayElement {
  private titleEl: HTMLDivElement;
  private closeBtn: Icon;
  private contentEl: HTMLDivElement;
  private _contentComponent?: BaseElement;
  private type: "modal" | "standard";

  constructor(title = "Side Sheet", type: "modal" | "standard" = "modal") {
    super("div", { 
      scrim: type === "modal", 
      dismissOnScrimClick: true, 
      dismissOnEscape: true, 
      exitAnimationMs: 300,
      mountToBody: type === "modal" 
    });
    this.type = type;
    this.element.className = sheetSva({ type, open: false });

    this.element.className = sheetSva({ type, open: false });

    const header = document.createElement("div");
    header.className = headerSva();

    this.titleEl = document.createElement("div");
    this.titleEl.className = titleSva();
    this.titleEl.textContent = title;
    header.appendChild(this.titleEl);

    this.closeBtn = new Icon(Icons.close);
    this.closeBtn.element.className = closeBtnSva();
    this.closeBtn.SetIconSize(24);
    this.closeBtn.element.addEventListener("click", () => this.Close());
    attachRipple(this.closeBtn.element);
    header.appendChild(this.closeBtn.element);

    this.element.appendChild(header);

    this.contentEl = document.createElement("div");
    this.contentEl.className = contentSva();
    this.element.appendChild(this.contentEl);

    Bind(this.GetIsOpenSignal(), (isOpen) => {
      this.element.className = sheetSva({ type: this.type, open: isOpen });
    });
  }

  SetTitle(title: string): this {
    this.titleEl.textContent = title;
    return this;
  }

  SetContent(content: string | BaseElement): this {
    if (this._contentComponent) {
      this._contentComponent.Dispose();
      this._contentComponent = undefined;
    }
    this.contentEl.innerHTML = "";
    if (typeof content === "string") {
      this.contentEl.textContent = content;
    } else {
      this._contentComponent = content;
      this.contentEl.appendChild(content.element);
    }
    return this;
  }

  override GetType(): string {
    return "SideSheet";
  }
}

function CreateSideSheet(title = "Side Sheet", type: "modal" | "standard" = "modal"): SideSheet {
  return new SideSheet(title, type);
}

/**
 * AddSideSheet function.
 * @param {LayoutElement} parent - The parent parameter
 * @param {any} title - The title parameter
 * @param {"modal" | "standard"} type - The type parameter
 * @returns {SideSheet}
 *
 */
export function AddSideSheet(parent: LayoutElement, title = "Side Sheet", type: "modal" | "standard" = "modal"): SideSheet {
  const sheet = CreateSideSheet(title, type);
  // Optional: add standard sheet to parent instead of body if desired
  if (type === "standard") {
    parent.AddChild(sheet);
  }
  return sheet;
}
