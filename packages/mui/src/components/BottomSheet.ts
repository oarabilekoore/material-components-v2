import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
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
  },
});

const sheetSva = sva({
  base: {
    position: "fixed",
    left: "0",
    right: "0",
    bottom: "0",
    backgroundColor: "var(--md-surface)",
    color: "var(--md-on-surface)",
    borderTopLeftRadius: "16px",
    borderTopRightRadius: "16px",
    padding: "16px 24px 24px",
    zIndex: 2000,
    maxHeight: "80vh",
    overflowY: "auto",
    transform: "translateY(100%)",
    transition: "transform 0.3s cubic-bezier(0.2, 0, 0, 1)",
    fontFamily: "var(--md-font-family, Roboto, sans-serif)",
    boxShadow: "0 -2px 8px rgba(0,0,0,0.1)",
  },
});

const handleSva = sva({
  base: {
    width: "40px",
    height: "4px",
    backgroundColor: "var(--md-outline-variant)",
    borderRadius: "2px",
    margin: "0 auto 12px",
  },
});

export class BottomSheet extends BaseElement {
  private scrim: HTMLElement;
  private contentEl: HTMLElement;
  private _isOpen: boolean = false;

  constructor() {
    super("div");
    this.scrim = document.createElement("div");
    this.scrim.className = scrimSva();
    this.scrim.addEventListener("click", () => this.Close());

    this.element.className = "m3-bottom-sheet " + sheetSva();

    const handle = document.createElement("div");
    handle.className = handleSva();
    this.element.appendChild(handle);

    this.contentEl = document.createElement("div");
    this.contentEl.className = "sheet-content";
    this.element.appendChild(this.contentEl);

    this.scrim.appendChild(this.element);
    if (typeof document !== "undefined") {
      document.body.appendChild(this.scrim);
    }
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

function CreateBottomSheet(): BottomSheet {
  return new BottomSheet();
}
