import { LayoutElement } from "./Layout.ts";

/** A scrollable container for a Layout. */
export class ScrollerElement extends LayoutElement {
  constructor() {
    super("Linear");
    this.element.style.overflow = "auto"; // default: scrolls both axes until options narrow it
  }

  /** Returns the control class name. */
  override GetType(): string {
    return "Scroller";
  }

  /** Parses the CreateScroller options string. */
  applyScrollerOptions(options?: string) {
    if (!options) return;
    const opts = options.split(",").map((o) => o.trim());

    if (opts.includes("FillX") || opts.includes("FillXY"))
      this.element.style.width = "100%";
    if (opts.includes("FillY") || opts.includes("FillXY"))
      this.element.style.height = "100%";

    if (opts.includes("Horizontal")) {
      this.SetOrientation("Horizontal");
      this.element.style.overflowX = "auto";
      this.element.style.overflowY = "hidden";
    } else if (opts.includes("Vertical")) {
      this.SetOrientation("Vertical");
      this.element.style.overflowX = "hidden";
      this.element.style.overflowY = "auto";
    }

    if (opts.includes("NoScrollBar")) {
      this.element.style.scrollbarWidth = "none"; // Firefox
      this.element.classList.add("fpct-no-scrollbar"); // WebKit needs the ::-webkit-scrollbar rule below
    }

    if (opts.includes("ScrollFade")) {
      this.element.style.maskImage =
        "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)";
    }
  }

  /** Scrolls to a fixed position. x/y are 0..1 fractions of scrollable range, or px with options.px. */
  ScrollTo(x: number, y: number, options?: { px?: boolean }) {
    if (options?.px) {
      this.element.scrollLeft = x;
      this.element.scrollTop = y;
    } else {
      this.element.scrollLeft =
        x * (this.element.scrollWidth - this.element.clientWidth);
      this.element.scrollTop =
        y * (this.element.scrollHeight - this.element.clientHeight);
    }
    return this;
  }

  /** Scrolls relative to the current position. */
  ScrollBy(x: number, y: number) {
    this.element.scrollLeft += x;
    this.element.scrollTop += y;
    return this;
  }

  /** Gets horizontal scroll position as a 0..1 fraction. */
  GetScrollX(): number {
    const range = this.element.scrollWidth - this.element.clientWidth;
    return range <= 0 ? 0 : this.element.scrollLeft / range;
  }

  /** Gets vertical scroll position as a 0..1 fraction. */
  GetScrollY(): number {
    const range = this.element.scrollHeight - this.element.clientHeight;
    return range <= 0 ? 0 : this.element.scrollTop / range;
  }
}
