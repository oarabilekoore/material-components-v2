import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { LayoutElement } from "../../../core/src/elements/Layout.ts";
import { sva } from "../../../core/src/utils/sva.ts";

const carouselSva = sva({
  base: {
    display: "flex",
    flexDirection: "row",
    overflowX: "auto",
    scrollSnapType: "x mandatory",
    gap: "12px",
    padding: "16px",
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
    scrollBehavior: "smooth",
    msOverflowStyle: "none",
    scrollbarWidth: "none",
  },
});

const itemSva = sva({
  base: {
    flex: "0 0 auto",
    scrollSnapAlign: "center",
    borderRadius: "16px",
    overflow: "hidden",
    boxSizing: "border-box",
    boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
    transition: "transform 0.2s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.2s cubic-bezier(0.2, 0, 0, 1), width 0.3s ease, height 0.3s ease",
    cursor: "pointer",
    "&:hover": {
      transform: "scale(1.02)",
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    },
  },
  variants: {
    layout: {
      "multi-browse": { width: "220px", height: "160px" },
      "uncontained": { width: "auto", height: "160px", paddingRight: "16px", scrollSnapAlign: "start" },
      "hero": { width: "400px", height: "240px" }
    }
  },
  defaultVariants: {
    layout: "multi-browse"
  }
});

let styleInjected = false;
function injectCarouselStyle() {
  if (styleInjected) return;
  styleInjected = true;
  if (typeof document !== "undefined") {
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
      .m3-carousel::-webkit-scrollbar {
        display: none;
      }
    `;
    document.head.appendChild(styleEl);
  }
}

export class Carousel extends BaseElement {
  private _layout: "multi-browse" | "uncontained" | "hero";

  constructor(layout: "multi-browse" | "uncontained" | "hero" = "multi-browse") {
    super("div");
    this._layout = layout;
    injectCarouselStyle();
    this.element.className = "m3-carousel " + carouselSva();
  }

  AddItem(item: BaseElement, width?: number, height?: number): this {
    const wrapper = document.createElement("div");
    wrapper.className = itemSva({ layout: this._layout });
    if (width) wrapper.style.width = `${width}px`;
    if (height) wrapper.style.height = `${height}px`;
    
    // Fill the wrapper
    if (item.element) {
      item.element.style.width = "100%";
      item.element.style.height = "100%";
      item.element.style.boxSizing = "border-box";
    }
    
    wrapper.appendChild(item.element);

    this.element.appendChild(wrapper);
    return this;
  }
  
  ScrollToNext(): this {
    this.element.scrollBy({ left: 220 + 12, behavior: "smooth" });
    return this;
  }
  
  ScrollToPrev(): this {
    this.element.scrollBy({ left: -(220 + 12), behavior: "smooth" });
    return this;
  }
}

function CreateCarousel(layout: "multi-browse" | "uncontained" | "hero" = "multi-browse"): Carousel {
  return new Carousel(layout);
}

/**
 * AddCarousel function.
 * @param {LayoutElement} parent - The parent parameter
 * @param {"multi-browse" | "uncontained" | "hero"} layout - The layout parameter
 * @returns {Carousel}
 *
 */
export function AddCarousel(parent: LayoutElement, layout: "multi-browse" | "uncontained" | "hero" = "multi-browse"): Carousel {
  const carousel = CreateCarousel(layout);
  parent.AddChild(carousel);
  return carousel;
}
