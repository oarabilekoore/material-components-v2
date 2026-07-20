import { OverlayElement } from "../../../core/src/elements/Overlay.ts";
import { sva } from "../../../core/src/utils/sva.ts";
import { Bind } from "../../../core/src/state/signals.ts";

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

export class BottomSheetEl extends OverlayElement {
  private contentEl: HTMLElement;

  constructor() {
    super("div", { scrim: true, dismissOnScrimClick: true, dismissOnEscape: true, exitAnimationMs: 300 });
    this.SetScrimColor("rgba(0, 0, 0, 0.32)");

    this.element.className = "m3-bottom-sheet " + sheetSva();

    const handle = document.createElement("div");
    handle.className = handleSva();
    this.element.appendChild(handle);

    this.contentEl = document.createElement("div");
    this.contentEl.className = "sheet-content";
    this.element.appendChild(this.contentEl);

    let initialBind = true;
    Bind(this.GetIsOpenSignal(), (isOpen) => {
      if (isOpen) {
        void this.element.offsetHeight;
        this.element.style.transform = "translateY(0)";
      } else {
        this.element.style.transform = "translateY(100%)";
      }
      initialBind = false;
    });
  }

  SetContent(content: string): this {
    this.contentEl.textContent = content;
    return this;
  }

  SetHtml(html: string): this {
    this.contentEl.innerHTML = html;
    return this;
  }



  override GetType(): string {
    return "BottomSheet";
  }
}

function CreateBottomSheet(): BottomSheetEl {
  return new BottomSheetEl();
}

/**
 * AddBottomSheet function.
 * @param {import("../../../core/src/elements/Layout.ts").LayoutElement} parent - The parent parameter
 * @returns {BottomSheetEl}
 */
export function BottomSheet(
): BottomSheetEl {
  const sheet = CreateBottomSheet();
  return sheet;
}
